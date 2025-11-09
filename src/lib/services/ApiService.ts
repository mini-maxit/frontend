import { TokenManager } from '../token';
import { env } from '$env/dynamic/private';
import { goto } from '$app/navigation';
import type { AuthTokenData } from '../dto/auth';
import { RequestMethod, RequestContentType, type Request } from '../dto/request';
import type { ApiResponse } from '../dto/response';
import { isApiErrorResponse } from '../dto/error';
import type { Cookies } from '@sveltejs/kit';
import { AppRoutes } from '$lib/routes';

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

export class ApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private cookies: Cookies | null = null;

  constructor(baseUrl: string = env.BACKEND_API_URL || 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;
  }

  /**
   * Set cookies for this API client instance
   * Must be called before making requests in server-side context
   */
  withCookies(cookies: Cookies): ApiService {
    this.cookies = cookies;
    return this;
  }

  private async refreshToken(): Promise<void> {
    if (!this.cookies) {
      throw new Error('Cookies not set. Call withCookies() before making requests.');
    }

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
          console.warn('Token refresh failed, clearing tokens and redirecting to login.');
          if (this.cookies) {
            TokenManager.clearTokens(this.cookies);
          }
          if (typeof window !== 'undefined') {
            goto(AppRoutes.Login);
          }
          throw new Error('Token refresh failed');
        }

        const data: ApiResponse<AuthTokenData> = await response.json();
        if (this.cookies) {
          TokenManager.setAccessToken(this.cookies, data.data);
        }
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request(request: Request): Promise<Response> {
    if (!this.cookies) {
      throw new Error('Cookies not set. Call withCookies() before making requests.');
    }

    const token = TokenManager.getAccessToken(this.cookies);

    const headers = new Headers(request.options?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (request.contentType) {
      headers.set('Content-Type', request.contentType);
    } else if (request.body && !(request.body instanceof FormData)) {
      headers.set('Content-Type', RequestContentType.Json);
    }

    let response = await fetch(`${this.baseUrl}${request.url}`, {
      method: request.method,
      body: request.body,
      ...request.options,
      headers,
      credentials: 'include'
    });

    if (response.status === 401 && !request.url.includes('/auth/login')) {
      await this.refreshToken();

      if (this.cookies) {
        const newToken = TokenManager.getAccessToken(this.cookies);
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(`${this.baseUrl}${request.url}`, {
            method: request.method,
            body: request.body,
            ...request.options,
            headers,
            credentials: 'include'
          });
        }
      }
    }

    return response;
  }

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

export function createApiClient(cookies: Cookies): ApiService {
  const client = new ApiService();
  client.withCookies(cookies);
  return client;
}
