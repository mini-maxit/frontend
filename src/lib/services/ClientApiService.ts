import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { AuthTokenData } from '../dto/auth';
import { RequestMethod, RequestContentType, type Request } from '../dto/request';
import type { ApiResponse } from '../dto/response';
import { isApiErrorResponse } from '../dto/error';
import { AppRoutes } from '$lib/routes';
import { ApiError } from './ApiService';

/**
 * Client-side API service for browser contexts
 * Uses HttpOnly cookies for secure token storage
 * Tokens are automatically sent with requests via credentials: 'include'
 */
export class ClientApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string) {
    if (!browser) {
      throw new Error('ClientApiService can only be used in browser context');
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Refresh the access token using the refresh token cookie
   * Handles race conditions by queuing concurrent refresh attempts
   */
  private async refreshToken(): Promise<void> {
    // If already refreshing, wait for the existing refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include' // Send refresh token cookie
        });

        if (!response.ok) {
          console.warn('Token refresh failed, redirecting to login.');
          // Clear any client state if needed
          goto(AppRoutes.Login);
          throw new Error('Token refresh failed');
        }

        // The backend will set the new access token as an HttpOnly cookie
        // We don't need to manually handle it - it's automatic
        const data: ApiResponse<AuthTokenData> = await response.json();
        console.log('Token refreshed successfully');
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make an HTTP request to the API
   * Automatically includes credentials (cookies) and handles 401 errors
   */
  private async request(request: Request): Promise<Response> {
    const headers = new Headers(request.options?.headers);

    // Set content type if specified
    if (request.contentType) {
      headers.set('Content-Type', request.contentType);
    } else if (request.body && !(request.body instanceof FormData)) {
      headers.set('Content-Type', RequestContentType.Json);
    }

    // Make the request with credentials to include HttpOnly cookies
    let response = await fetch(`${this.baseUrl}${request.url}`, {
      method: request.method,
      body: request.body,
      ...request.options,
      headers,
      credentials: 'include' // Critical: includes HttpOnly cookies
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !request.url.includes('/auth/login')) {
      try {
        await this.refreshToken();

        // Retry the original request after refresh
        response = await fetch(`${this.baseUrl}${request.url}`, {
          method: request.method,
          body: request.body,
          ...request.options,
          headers,
          credentials: 'include'
        });
      } catch (error) {
        // If refresh fails, the user will be redirected to login
        throw error;
      }
    }

    return response;
  }

  /**
   * Parse error response body
   */
  private async parseErrorBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('Content-Type');
    const clonedResponse = response.clone();

    if (contentType?.includes('application/json')) {
      try {
        const data = await clonedResponse.json();

        if (isApiErrorResponse(data)) {
          return data;
        }

        console.warn('API returned JSON error response in unexpected format:', data);
        return data;
      } catch (error) {
        console.error('Failed to parse JSON error response:', error);
      }
    }

    try {
      return await response.text();
    } catch (error) {
      console.error('Failed to parse error response as text:', error);
      return null;
    }
  }

  async get<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.GET
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      const error = new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.GET,
        body
      );

      console.error('API GET request failed:', error.toJSON());
      throw error;
    }

    return response.json();
  }

  async post<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.POST
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      const error = new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.POST,
        body
      );

      console.error('API POST request failed:', error.toJSON());
      throw error;
    }

    return response.json();
  }

  async put<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.PUT
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      const error = new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.PUT,
        body
      );

      console.error('API PUT request failed:', error.toJSON());
      throw error;
    }

    return response.json();
  }

  async patch<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.PATCH
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      const error = new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.PATCH,
        body
      );

      console.error('API PATCH request failed:', error.toJSON());
      throw error;
    }

    return response.json();
  }

  async delete<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.DELETE
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      const error = new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.DELETE,
        body
      );

      console.error('API DELETE request failed:', error.toJSON());
      throw error;
    }

    return response.json();
  }
}

/**
 * Create a client-side API client for browser use
 * Requires PUBLIC_BACKEND_API_URL environment variable
 */
export function createClientApiClient(baseUrl?: string): ClientApiService {
  if (!browser) {
    throw new Error('createClientApiClient can only be used in browser context');
  }

  // Use provided URL or fall back to public env variable
  const apiUrl = baseUrl || import.meta.env.PUBLIC_BACKEND_API_URL || 'http://localhost:8000/api/v1';
  return new ClientApiService(apiUrl);
}
