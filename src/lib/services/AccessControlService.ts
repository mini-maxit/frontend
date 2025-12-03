import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Collaborator } from '../dto/accessControl';

export class AccessControlService {
  constructor(private apiClient: ApiService) {}

  /**
   * Get collaborators for a specific task.
   * Only users with edit permission or higher can see collaborators.
   */
  async getTaskCollaborators(taskId: number): Promise<{
    success: boolean;
    status: number;
    data?: Collaborator[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Collaborator[]>>({
        url: `/access-control/tasks/${taskId}/collaborators`
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
