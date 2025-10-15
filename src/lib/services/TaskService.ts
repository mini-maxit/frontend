import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Task, UploadTaskResponse } from '../dto/task';

export class TaskService {
  constructor(private apiClient: ApiService) {}

  async uploadTask(
    title: string,
    archive: File
  ): Promise<{ success: boolean; status: number; data?: UploadTaskResponse; error?: string }> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('archive', archive);

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
}
