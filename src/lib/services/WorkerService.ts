import type { ApiResponse } from '../dto/response';
import type { WorkerStatus } from '../dto/worker';
import type { ApiService } from './ApiService';

export class WorkerService {
  constructor(private apiService: ApiService) {}

  async getWorkerStatus(): Promise<WorkerStatus> {
    const response: ApiResponse<WorkerStatus> = await this.apiService.get({
      url: '/workers/status'
    });
    return response.data;
  }
}
