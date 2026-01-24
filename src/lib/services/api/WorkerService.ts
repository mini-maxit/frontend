import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type { ApiResponse } from '$lib/dto/response';
import type { WorkerStatus } from '$lib/dto/worker';

/**
 * Client-side service for worker status API calls
 * Mirrors the server-side WorkerService API
 */
export class WorkerService {
  constructor(private apiClient: ApiService) {}

  async getWorkerStatus(): Promise<{
    success: boolean;
    status: number;
    data?: WorkerStatus;
    error?: string;
  }> {
    try {
      const response: ApiResponse<WorkerStatus> = await this.apiClient.get({
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
