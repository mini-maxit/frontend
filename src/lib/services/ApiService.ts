import { TokenManager } from '../token';
import { PUBLIC_API_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import type { OAuth2TokenDto } from '../dto/auth';
import { RequestMethod, RequestContentType, type Request } from '../dto/request';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public url: string,
    public method: string,
    public body?: unknown
  ) {
    super(`${method} ${url} failed: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = PUBLIC_API_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshToken(): Promise<void> {
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
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            goto('/login');
          }
          throw new Error('Token refresh failed');
        }

        const data: OAuth2TokenDto = await response.json();
        TokenManager.setAccessToken(data.access_token, data.expires_in);
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request(request: Request): Promise<Response> {
    const token = TokenManager.getAccessToken();

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

    if (response.status === 401) {
      await this.refreshToken();

      const newToken = TokenManager.getAccessToken();
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

    if (!response.ok) {
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const data = await response.json();
        console.error('API Error:', data);
      } else {
        const text = await response.text();
        console.error('API Error (non-JSON):', text);
      }
    }

    return response;
  }

  private async parseErrorBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      return response.json().catch(() => null);
    }
    return response.text().catch(() => null);
  }

  async get<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.GET
    });
    if (!response.ok) {
      const body = await this.parseErrorBody(response);
      throw new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.GET,
        body
      );
    }
    return response.json();
  }

  async post<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.POST
    });
    if (!response.ok) {
      const errorBody = await this.parseErrorBody(response);
      throw new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.POST,
        errorBody
      );
    }
    return response.json();
  }

  async put<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.PUT
    });
    if (!response.ok) {
      const errorBody = await this.parseErrorBody(response);
      throw new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.PUT,
        errorBody
      );
    }
    return response.json();
  }

  async patch<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.PATCH
    });
    if (!response.ok) {
      const errorBody = await this.parseErrorBody(response);
      throw new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.PATCH,
        errorBody
      );
    }
    return response.json();
  }

  async delete<T>(request: Omit<Request, 'method'>): Promise<T> {
    const response = await this.request({
      ...request,
      method: RequestMethod.DELETE
    });
    if (!response.ok) {
      const errorBody = await this.parseErrorBody(response);
      throw new ApiError(
        response.status,
        response.statusText,
        request.url,
        RequestMethod.DELETE,
        errorBody
      );
    }
    return response.json();
  }
}

export const apiClient = new ApiService();
