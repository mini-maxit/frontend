import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type { User, UserEditDto } from '$lib/dto/user';
import type { ApiResponse } from '$lib/dto/response';
import { RequestContentType } from '$lib/dto/request';

/**
 * Client-side service for user management (admin operations)
 */
export class UserManagementService {
  constructor(private apiClient: ApiService) {}

  /**
   * Get user by ID
   */
  async getUserById(
    userId: number
  ): Promise<{ success: boolean; status: number; data?: User; error?: string }> {
    try {
      const response = await this.apiClient.get<ApiResponse<User>>({
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

  /**
   * Update user details (admin only)
   */
  async updateUser(
    userId: number,
    data: UserEditDto
  ): Promise<{ success: boolean; status: number; data?: User; error?: string }> {
    try {
      const response = await this.apiClient.patch<ApiResponse<User>>({
        url: `/users/${userId}`,
        body: JSON.stringify(data),
        contentType: RequestContentType.Json
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

}
