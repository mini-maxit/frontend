import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse, PaginatedData } from '../dto/response';
import type { Group } from '../dto/group';

export class GroupsManagementService {
  constructor(private apiClient: ApiService) {}

  async getGroups(): Promise<{
    success: boolean;
    status: number;
    data?: Group[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<PaginatedData<Group>>>({
        url: '/groups-management/groups'
      });
      return { success: true, data: response.data.items, status: 200 };
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
