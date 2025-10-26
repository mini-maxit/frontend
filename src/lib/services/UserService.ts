import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { User } from '../dto/user';

export class UserService {
  constructor(private apiClient: ApiService) {}

  async getCurrentUser(): Promise<{
    success: boolean;
    status: number;
    data?: User;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<User>>({
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
}
