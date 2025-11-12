import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { WorkerStatus } from '../dto/worker';

export class WorkerService {
  constructor(private apiService: ApiService) {}

  async getWorkerStatus(): Promise<{
    success: boolean;
    status: number;
    data?: WorkerStatus;
    error?: string;
  }> {
    try {
      const response: ApiResponse<WorkerStatus> = await this.apiService.get({
        url: '/workers/status'
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
