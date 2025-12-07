import { ApiError } from '../ApiService';
import type { ClientApiService } from './ClientApiService';
import type { User } from '../../dto/user';
import type { ApiResponse } from '../../dto/response';
import { userStore } from '$lib/stores/user-store.svelte';

/**
 * Client-side user service
 * Uses in-memory user storage
 */
export class ClientUserService {
  constructor(private apiClient: ClientApiService) {}

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
}
