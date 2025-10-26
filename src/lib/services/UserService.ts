import type { ApiResponse } from '../dto/response';
import type { User, UserChangePasswordDto } from '../dto/user';
import type { ApiService } from './ApiService';

export class UserService {
  constructor(private apiService: ApiService) {}

  async getUserById(id: number): Promise<User> {
    const response: ApiResponse<User> = await this.apiService.get({
      url: `/users/${id}`
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: ApiResponse<User> = await this.apiService.get({
      url: '/users/me'
    });
    return response.data;
  }

  async changePassword(userId: number, passwordData: UserChangePasswordDto): Promise<void> {
    await this.apiService.patch({
      url: `/users/${userId}/password`,
      body: JSON.stringify(passwordData)
    });
  }
}
