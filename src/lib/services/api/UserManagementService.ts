import type { ApiService } from './ApiService';
import { resolveErrorMessage } from '#lib/errors/backend-error.js';
import { ApiError } from './ApiService';
import type { User, UserEditDto } from '#lib/dto/user.js';
import type { ApiResponse } from '#lib/dto/response.js';
import { RequestContentType } from '#lib/dto/request.js';

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
          error: resolveErrorMessage(error),
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
          error: resolveErrorMessage(error),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  /**
   * Reset user password to a new random one (admin only). The password is returned only once.
   */
  async resetPassword(
    userId: number
  ): Promise<{ success: boolean; status: number; data?: string; error?: string }> {
    try {
      const response = await this.apiClient.post<ApiResponse<{ newPassword: string }>>({
        url: `/users/${userId}/password/reset`
      });
      return { success: true, data: response.data.newPassword, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: resolveErrorMessage(error),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  private async call(url: string, method: 'delete' | 'post') {
    try {
      await this.apiClient[method]<ApiResponse<unknown>>({ url });
      return { success: true, status: 200 } as { success: boolean; status: number; error?: string };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: resolveErrorMessage(error), status: error.getStatus() };
      }
      throw error;
    }
  }

  /** Soft-delete a user (admin only). */
  deleteUser(userId: number) {
    return this.call(`/users/${userId}`, 'delete');
  }

  /** Restore a soft-deleted user (admin only). */
  restoreUser(userId: number) {
    return this.call(`/users/${userId}/restore`, 'post');
  }
}
