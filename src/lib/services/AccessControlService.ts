import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Collaborator, Permission } from '../dto/accessControl';

export interface AddCollaboratorRequest {
  user_id: number;
  permission: Permission;
}

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

  /**
   * Add a collaborator to a specific task.
   * Only users with manage permission can add collaborators.
   */
  async addTaskCollaborator(
    taskId: number,
    data: AddCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/access-control/tasks/${taskId}/collaborators`,
        body: JSON.stringify(data)
      });
      return { success: true, status: 201 };
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

  /**
   * Get collaborators for a specific contest.
   * Only users with edit permission or higher can see collaborators.
   */
  async getContestCollaborators(contestId: number): Promise<{
    success: boolean;
    status: number;
    data?: Collaborator[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Collaborator[]>>({
        url: `/access-control/contests/${contestId}/collaborators`
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
