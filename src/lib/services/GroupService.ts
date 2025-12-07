import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Group } from '../dto/group';

export class GroupService {
  constructor(private apiService: ApiService) {}

  async listGroups(): Promise<{
    success: boolean;
    status: number;
    data?: Group[];
    error?: string;
  }> {
    try {
      const response: ApiResponse<Group[]> = await this.apiService.get({
        url: '/groups-management/groups'
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

  async getGroup(groupId: number): Promise<{
    success: boolean;
    status: number;
    data?: Group;
    error?: string;
  }> {
    try {
      const response: ApiResponse<Group> = await this.apiService.get({
        url: `/groups-management/groups/${groupId}`
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
