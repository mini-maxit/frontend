import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { User, UserChangePasswordDto, UserEditDto } from '../dto/user';

export class UserService {
  constructor(private apiService: ApiService) {}

  async getCurrentUser(): Promise<{
    success: boolean;
    status: number;
    data?: User;
    error?: string;
  }> {
    try {
      const response: ApiResponse<User> = await this.apiService.get({
        url: '/users/me'
      });
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

  async changePassword(
    userId: number,
    passwordData: UserChangePasswordDto
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiService.patch({
        url: `/users/${userId}/password`,
        body: JSON.stringify(passwordData)
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

  async listUsers(params?: { limit?: number; offset?: number; sort?: string }): Promise<{
    success: boolean;
    status: number;
    data?: User[];
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.offset !== undefined) {
        queryParams.append('offset', params.offset.toString());
      }
      if (params?.sort) {
        queryParams.append('sort', params.sort);
      }

      const url = `/users/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: ApiResponse<User[]> = await this.apiService.get({ url });
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

  async getUserById(userId: number): Promise<{
    success: boolean;
    status: number;
    data?: User;
    error?: string;
  }> {
    try {
      const response: ApiResponse<User> = await this.apiService.get({
        url: `/users/${userId}`
      });
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

  async editUser(
    userId: number,
    userData: UserEditDto
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiService.patch({
        url: `/users/${userId}`,
        body: JSON.stringify(userData)
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
