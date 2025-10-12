import { ApiError, type ApiService } from './ApiService';
import type { AuthTokenData } from '../dto/auth';
import type { UserLoginDto, UserRegisterDto } from '../dto/user';
import { RequestContentType } from '../dto/request';
import type { ApiResponse } from '../dto/response';

export class AuthService {
  constructor(private apiClient: ApiService) {}

  async login(
    body: UserLoginDto
  ): Promise<{ success: boolean; status: number; data?: AuthTokenData; error?: string }> {
    try {
      const response = await this.apiClient.post<ApiResponse<AuthTokenData>>({
        url: '/auth/login',
        body: JSON.stringify(body),
        contentType: RequestContentType.Json
      });

      return { success: true, data: response.data, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getUserMessage(),
          status: error.getStatus()
        };
      }

      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage, status: 500 };
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

      return { success: true, data: response.data, status: 201 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getUserMessage(),
          status: error.getStatus()
        };
      }

      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage, status: 500 };
    }
  }

  async logout(): Promise<{ success: boolean; status: number; error?: string }> {
    try {
      await this.apiClient.post({
        url: '/auth/logout',
        body: ''
      });

      return { success: true, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getUserMessage(),
          status: error.getStatus()
        };
      }

      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      return { success: false, error: errorMessage, status: 500 };
    }
  }
}
