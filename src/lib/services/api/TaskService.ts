import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type { Task, TaskDetail, MyTasksResponse } from '$lib/dto/task';
import type { ApiResponse } from '$lib/dto/response';

/**
 * Client-side service for task-related API calls
 * Mirrors the server-side TaskService API
 */
export class TaskService {
  constructor(private apiClient: ApiService) {}

  /**
   * Get all available tasks
   * @returns List of all tasks
   */
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

  /**
   * Get task details by ID
   * @param id - Task ID
   * @returns Task details
   */
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

  /**
   * Get current user's tasks with optional pagination
   * @param params - Optional pagination parameters
   * @returns User's tasks with pagination metadata
   */
  async getMyTasks(params?: { limit?: number; offset?: number }): Promise<{
    success: boolean;
    status: number;
    data?: MyTasksResponse;
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/tasks/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await this.apiClient.get<ApiResponse<MyTasksResponse>>({
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
   * Get contest task details by contest and task ID
   */
  async getContestTask(
    contestId: number,
    taskId: number
  ): Promise<{
    success: boolean;
    status: number;
    data?: TaskDetail;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<TaskDetail>>({
        url: `/contests/${contestId}/tasks/${taskId}`
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
