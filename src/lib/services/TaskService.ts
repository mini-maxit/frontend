import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Task, TaskDetail } from '../dto/task';

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
}
