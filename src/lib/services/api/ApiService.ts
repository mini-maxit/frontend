import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { RequestMethod, RequestContentType, type Request } from '../../dto/request';
import { isApiErrorResponse } from '../../dto/error';
import { AppRoutes } from '$lib/routes';
import { tokenStore } from '$lib/stores/token-store.svelte';
import type { ApiResponse } from '../../dto/response';
import type { AuthTokenData } from '../../dto/auth';

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;
  public readonly method: string;
  public readonly code?: string;
  public readonly body?: unknown;

  constructor(status: number, statusText: string, url: string, method: string, body?: unknown) {
    const message = isApiErrorResponse(body)
      ? `${body.data.code}: ${body.data.message}`
      : `${method} ${url} failed: ${status} ${statusText}`;

    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.method = method;
    this.body = body;

    if (isApiErrorResponse(body)) {
      this.code = body.data.code;
    }
  }

  getApiMessage(): string {
    if (isApiErrorResponse(this.body)) {
      return this.body.data.message;
    }
    return this.statusText || 'An unexpected error occurred';
  }

  getStatus(): number {
    return this.status;
  }

  toJSON(): {
    name: string;
    message: string;
    status: number;
    statusText: string;
    url: string;
    method: string;
    code?: string;
    body?: unknown;
  } {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      method: this.method,
      code: this.code,
      body: this.body
    };
  }
}

/**
 * Client-side API service for browser contexts
 * Uses in-memory token storage with refresh token in HttpOnly cookie
 * - Access token: stored in memory (cleared on page refresh)
 * - Refresh token: stored in HttpOnly cookie by backend (secure, persistent)
 * - Silent refresh: automatically fetches new access token on page load
 */
export class ApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string) {
    if (!browser) {
      throw new Error('ApiService can only be used in browser context');
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Refresh the access token using the refresh token cookie
   * Handles race conditions by queuing concurrent refresh attempts
   * Returns the new access token
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
          credentials: 'include'
        });

        if (!response.ok) {
          console.warn('Token refresh failed, redirecting to login.');
          tokenStore.clearAccessToken();
          goto(AppRoutes.Login);
          throw new Error('Token refresh failed');
        }

        // Backend returns new access token in response body
        const data = (await response.json()) as ApiResponse<AuthTokenData>;
        if (data.data?.accessToken) {
          tokenStore.setAccessToken(data.data.accessToken);
        }
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Silent refresh - get new access token on app initialization
   * Call this on page load to restore authentication state
   */
  async silentRefresh(): Promise<boolean> {
    try {
      await this.refreshToken();
      return tokenStore.hasToken();
    } catch (error) {
      return false;
    }
  }

  /**
   * Make an HTTP request to the API
   * Automatically includes access token from memory and handles 401 errors
   */
  private async request(request: Request): Promise<Response> {
    const headers = new Headers(request.options?.headers);

    // Set content type if specified
    if (request.contentType) {
      headers.set('Content-Type', request.contentType);
    } else if (request.body && !(request.body instanceof FormData)) {
      headers.set('Content-Type', RequestContentType.Json);
    }

    // Add access token from memory if available
    const token = tokenStore.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Make the request with credentials to include HttpOnly refresh token cookie
    let response = await fetch(`${this.baseUrl}${request.url}`, {
      method: request.method,
      body: request.body,
      ...request.options,
      headers,
      credentials: 'include'
    });

    // Handle 401 Unauthorized - try to refresh token
    // Skip refresh for auth endpoints to prevent infinite loops
    if (response.status === 401 && !request.url.includes('/auth')) {
      try {
        await this.refreshToken();

        // Retry the original request with new token
        const newToken = tokenStore.getAccessToken();
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
        }

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
