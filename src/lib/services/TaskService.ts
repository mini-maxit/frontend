import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Task, TaskDetail, MyTasksResponse } from '../dto/task';
import { createApiClient } from './ApiService';
import type { Cookies } from '@sveltejs/kit';

export class TaskService {
  constructor(private apiClient: ApiService) {}

  async getAllTasks(): Promise<{
    success: boolean;
    status: number;
    data?: Task[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Task[]>>({
        url: '/tasks'
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

  async getTaskById(id: number): Promise<{
    success: boolean;
    status: number;
    data?: TaskDetail;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<TaskDetail>>({
        url: `/tasks/${id}`
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

  async getMyTasks(params?: { limit?: number; offset?: number }): Promise<{
    success: boolean;
    status: number;
    data?: MyTasksResponse;
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/tasks/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await this.apiClient.get<ApiResponse<MyTasksResponse>>({
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

export function createTaskService(cookies: Cookies): TaskService {
  const apiClient = createApiClient(cookies);
  return new TaskService(apiClient);
}
