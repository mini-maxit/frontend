import { ApiError } from '../ApiService';
import type { ClientApiService } from './ClientApiService';
import type { AuthTokenData } from '../../dto/auth';
import type { UserLoginDto, UserRegisterDto } from '../../dto/user';
import { RequestContentType } from '../../dto/request';
import type { ApiResponse } from '../../dto/response';
import { tokenStore } from '$lib/stores/token-store.svelte';
import { userStore } from '$lib/stores/user-store.svelte';

/**
 * Client-side authentication service
 * Uses in-memory token storage with HttpOnly refresh token cookie
 * - Access token: stored in memory (better security, cleared on refresh)
 * - Refresh token: stored in HttpOnly cookie by backend (secure, persistent)
 */
export class ClientAuthService {
  constructor(private apiClient: ClientApiService) {}

  async login(
    body: UserLoginDto
  ): Promise<{ success: boolean; status: number; data?: AuthTokenData; error?: string }> {
    try {
      const response = await this.apiClient.post<ApiResponse<AuthTokenData>>({
        url: '/auth/login',
        body: JSON.stringify(body),
        contentType: RequestContentType.Json
      });

      // Backend returns access token in response body and sets refresh token in HttpOnly cookie
      if (response.data?.accessToken) {
        tokenStore.setAccessToken(response.data.accessToken);
      }

      return { success: true, data: response.data, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  async register(
    body: UserRegisterDto
  ): Promise<{ success: boolean; status: number; data?: AuthTokenData; error?: string }> {
    try {
      const response = await this.apiClient.post<ApiResponse<AuthTokenData>>({
        url: '/auth/register',
        body: JSON.stringify(body),
        contentType: RequestContentType.Json
      });

      // Backend returns access token in response body and sets refresh token in HttpOnly cookie
      if (response.data?.accessToken) {
        tokenStore.setAccessToken(response.data.accessToken);
      }

      return { success: true, data: response.data, status: 201 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  async logout(): Promise<{ success: boolean; status: number; error?: string }> {
    try {
      await this.apiClient.post({
        url: '/auth/logout'
      });

      // Clear in-memory token and user, backend clears HttpOnly refresh cookie
      tokenStore.clearAccessToken();
      userStore.clearUser();
      return { success: true, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  /**
   * Manually trigger a token refresh
   * Useful for proactively refreshing tokens before they expire
   */
  async refreshToken(): Promise<{ success: boolean; status: number; error?: string }> {
    try {
      await this.apiClient.post({
        url: '/auth/refresh'
      });

      return { success: true, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }
}
