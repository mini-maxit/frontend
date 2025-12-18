import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse, PaginatedData } from '../dto/response';
import type {
  Collaborator,
  AddCollaboratorRequest,
  UpdateCollaboratorRequest
} from '../dto/accessControl';
import { ResourceType } from '../dto/accessControl';
import type { User } from '../dto/user';

export class AccessControlService {
  constructor(private apiClient: ApiService) {}

  /**
   * Get assignable users for a resource.
   * Returns users (teachers) who can be granted access to the resource.
   * Only users with manage permission can view assignable users.
   * Returned users do not currently have any access entry for the resource.
   */
  async getAssignableUsers(
    resourceType: ResourceType,
    resourceId: number,
    params?: { limit?: number; offset?: number; sort?: string }
  ): Promise<{
    success: boolean;
    status: number;
    data?: PaginatedData<User>;
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit !== undefined) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.offset !== undefined) {
        queryParams.append('offset', params.offset.toString());
      }
      if (params?.sort) {
        queryParams.append('sort', params.sort);
      }

      const url = `/access-control/resources/${resourceType}/${resourceId}/assignable${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.apiClient.get<ApiResponse<PaginatedData<User>>>({
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

  /**
   * Get collaborators for a resource.
   * Only users with edit permission or higher can see collaborators.
   */
  async getCollaborators(
    resourceType: ResourceType,
    resourceId: number
  ): Promise<{
    success: boolean;
    status: number;
    data?: Collaborator[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Collaborator[]>>({
        url: `/access-control/resources/${resourceType}/${resourceId}/collaborators`
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
   * Add a collaborator to a resource.
   * Only users with manage permission can add collaborators.
   */
  async addCollaborator(
    resourceType: ResourceType,
    resourceId: number,
    data: AddCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/access-control/resources/${resourceType}/${resourceId}/collaborators`,
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
   * Update a collaborator's permission on a resource.
   * Only users with manage permission can update collaborators.
   */
  async updateCollaborator(
    resourceType: ResourceType,
    resourceId: number,
    userId: number,
    data: UpdateCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.put<ApiResponse<void>>({
        url: `/access-control/resources/${resourceType}/${resourceId}/collaborators/${userId}`,
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
   * Remove a collaborator from a resource.
   * Only users with manage or owner permission can remove collaborators.
   * Managers can only remove editors and managers, owners can remove everyone except other owners.
   */
  async deleteCollaborator(
    resourceType: ResourceType,
    resourceId: number,
    userId: number
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.delete<ApiResponse<void>>({
        url: `/access-control/resources/${resourceType}/${resourceId}/collaborators/${userId}`
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

  // Legacy compatibility methods - these delegate to the new unified methods
  /**
   * @deprecated Use getCollaborators with ResourceType.Tasks instead
   */
  async getTaskCollaborators(taskId: number): Promise<{
    success: boolean;
    status: number;
    data?: Collaborator[];
    error?: string;
  }> {
    return this.getCollaborators(ResourceType.Tasks, taskId);
  }

  /**
   * @deprecated Use addCollaborator with ResourceType.Tasks instead
   */
  async addTaskCollaborator(
    taskId: number,
    data: AddCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    return this.addCollaborator(ResourceType.Tasks, taskId, data);
  }

  /**
   * @deprecated Use updateCollaborator with ResourceType.Tasks instead
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
    return this.updateCollaborator(ResourceType.Tasks, taskId, userId, data);
  }

  /**
   * @deprecated Use deleteCollaborator with ResourceType.Tasks instead
   */
  async deleteTaskCollaborator(
    taskId: number,
    userId: number
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    return this.deleteCollaborator(ResourceType.Tasks, taskId, userId);
  }

  /**
   * @deprecated Use getCollaborators with ResourceType.Contests instead
   */
  async getContestCollaborators(contestId: number): Promise<{
    success: boolean;
    status: number;
    data?: Collaborator[];
    error?: string;
  }> {
    return this.getCollaborators(ResourceType.Contests, contestId);
  }

  /**
   * @deprecated Use addCollaborator with ResourceType.Contests instead
   */
  async addContestCollaborator(
    contestId: number,
    data: AddCollaboratorRequest
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    return this.addCollaborator(ResourceType.Contests, contestId, data);
  }

  /**
   * @deprecated Use updateCollaborator with ResourceType.Contests instead
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
    return this.updateCollaborator(ResourceType.Contests, contestId, userId, data);
  }

  /**
   * @deprecated Use deleteCollaborator with ResourceType.Contests instead
   */
  async deleteContestCollaborator(
    contestId: number,
    userId: number
  ): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    return this.deleteCollaborator(ResourceType.Contests, contestId, userId);
  }
}
