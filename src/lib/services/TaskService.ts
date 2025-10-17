import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Task, TaskDetail, UploadTaskResponse, UploadTaskDto } from '../dto/task';

export class TaskService {
  constructor(private apiClient: ApiService) {}

  async uploadTask(
    body: UploadTaskDto
  ): Promise<{ success: boolean; status: number; data?: UploadTaskResponse; error?: string }> {
    const formData = new FormData();
    formData.append('title', body.title);
    formData.append('archive', body.archive);

    try {
      const response = await this.apiClient.post<ApiResponse<UploadTaskResponse>>({
        url: '/task/',
        body: formData
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

  async getAllTasks(): Promise<{
    success: boolean;
    status: number;
    data?: Task[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Task[]>>({
        url: '/task/'
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
        url: `/task/${id}`
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
