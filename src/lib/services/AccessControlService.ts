import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Collaborator, Permission } from '../dto/accessControl';

export interface AddCollaboratorRequest {
  user_id: number;
  permission: Permission;
}

export interface UpdateCollaboratorRequest {
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
   * Update a collaborator's permission on a specific task.
   * Only users with manage permission can update collaborators.
   */
  async updateTaskCollaborator(
    taskId: number,
    userId: number,
    data: UpdateCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.put<ApiResponse<void>>({
        url: `/access-control/tasks/${taskId}/collaborators/${userId}`,
        body: JSON.stringify(data)
      });
      return { success: true, status: 200 };
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
   * Remove a collaborator from a specific task.
   * Only users with manage or owner permission can remove collaborators.
   * Managers can only remove editors and managers, owners can remove everyone except other owners.
   */
  async deleteTaskCollaborator(
    taskId: number,
    userId: number
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.delete<ApiResponse<void>>({
        url: `/access-control/tasks/${taskId}/collaborators/${userId}`
      });
      return { success: true, status: 200 };
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

  /**
   * Add a collaborator to a specific contest.
   * Only users with manage permission can add collaborators.
   */
  async addContestCollaborator(
    contestId: number,
    data: AddCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/access-control/contests/${contestId}/collaborators`,
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
   * Update a collaborator's permission on a specific contest.
   * Only users with manage permission can update collaborators.
   */
  async updateContestCollaborator(
    contestId: number,
    userId: number,
    data: UpdateCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.put<ApiResponse<void>>({
        url: `/access-control/contests/${contestId}/collaborators/${userId}`,
        body: JSON.stringify(data)
      });
      return { success: true, status: 200 };
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
   * Remove a collaborator from a specific contest.
   * Only users with manage or owner permission can remove collaborators.
   * Managers can only remove editors and managers, owners can remove everyone except other owners.
   */
  async deleteContestCollaborator(
    contestId: number,
    userId: number
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.delete<ApiResponse<void>>({
        url: `/access-control/contests/${contestId}/collaborators/${userId}`
      });
      return { success: true, status: 200 };
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
