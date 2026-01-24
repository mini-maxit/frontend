import { ApiError } from '../ApiService';
import type { ApiService } from './ApiService';
import type { User } from '../../dto/user';
import type { ApiResponse, PaginatedData } from '../../dto/response';
import { userStore } from '$lib/stores/user-store.svelte';
import { RequestContentType } from '../../dto/request';

/**
 * Client-side user service
 * Uses in-memory user storage
 */
export class UserService {
  constructor(private apiClient: ApiService) {}

  /**
   * Fetch current authenticated user and store in userStore
   */
  async getCurrentUser(): Promise<{
    success: boolean;
    status: number;
    data?: User;
    error?: string;
  }> {
    try {
      userStore.setLoading(true);
      const response = await this.apiClient.get<ApiResponse<User>>({
        url: '/users/me'
      });

      if (response.data) {
        userStore.setUser(response.data);
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
    } finally {
      userStore.setLoading(false);
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    data: { oldPassword: string; newPassword: string }
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.put<ApiResponse<void>>({
        url: `/users/${userId}/password`,
        body: JSON.stringify(data),
        contentType: RequestContentType.Json
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

  /**
   * Get all users (admin only) with pagination
   */
  async getUsers(params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    role?: string;
  }): Promise<{
    success: boolean;
    status: number;
    data?: PaginatedData<User>;
    error?: string;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());
    if (params?.sort) queryParams.set('sort', params.sort);
    if (params?.role) queryParams.set('role', params.role);

    const url = queryParams.toString() ? `/users?${queryParams.toString()}` : '/users';

    try {
      const response = await this.apiClient.get<ApiResponse<PaginatedData<User>>>({
        url
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
