import { apiClient } from './ApiService';
import type { OAuth2TokenDto } from '../dto/auth';
import type { UserLoginDto, UserRegisterDto } from '../dto/user';
import { RequestContentType } from '../dto/request';

export class AuthService {
  async login(
    body: UserLoginDto
  ): Promise<{ success: boolean; data?: OAuth2TokenDto; error?: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('email', body.email);
      formData.append('password', body.password);

      const data = await apiClient.post<OAuth2TokenDto>({
        url: '/auth/login',
        body: formData.toString(),
        contentType: RequestContentType.FormURLEncoded
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    }
  }

  async register(
    body: UserRegisterDto
  ): Promise<{ success: boolean; data?: OAuth2TokenDto; error?: string }> {
    try {
      const data = await apiClient.post<OAuth2TokenDto>({
        url: '/auth/register',
        body: JSON.stringify(body),
        contentType: RequestContentType.Json
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post({
        url: '/auth/logout',
        body: ''
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      return { success: false, error: errorMessage };
    }
  }
}

export const authService = new AuthService();
