import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type {
  Contest,
  ContestWithStats,
  PastContestWithStats,
  ContestResults,
  ContestDetailed
} from '$lib/dto/contest';
import type { ContestTaskWithStatistics, TaskDetail } from '$lib/dto/task';
import type { ApiResponse, PaginatedData } from '$lib/dto/response';

/**
 * Client-side service for contest-related API calls
 * Mirrors the server-side ContestService API (throws errors)
 */
export class ContestService {
  constructor(private apiClient: ApiService) {}

  async getUserContests(): Promise<{
    success: boolean;
    status: number;
    data?: {
      active: ContestWithStats[];
      past: PastContestWithStats[];
    };
    error?: string;
  }> {
    const [activeResult, pastResult] = await Promise.allSettled([
      this.getMyActiveContests(),
      this.getMyPastContests()
    ]);

    if (activeResult.status === 'rejected' && pastResult.status === 'rejected') {
      const error = activeResult.reason;
      if (error instanceof ApiError) {
        return { success: false, error: error.getApiMessage(), status: error.getStatus() };
      }
      throw error;
    }

    return {
      success: true,
      status: 200,
      data: {
        active: activeResult.status === 'fulfilled' ? activeResult.value : [],
        past: pastResult.status === 'fulfilled' ? pastResult.value : []
      }
    };
  }

  async getOngoing(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<PaginatedData<Contest>>>({
        url: '/contests?status=ongoing'
      });
      return response.data.items;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get ongoing contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getUpcoming(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<PaginatedData<Contest>>>({
        url: '/contests?status=upcoming'
      });
      return response.data.items;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get upcoming contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getPast(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<PaginatedData<Contest>>>({
        url: '/contests?status=past'
      });
      return response.data.items;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get past contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getMyActiveContests(): Promise<ContestWithStats[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestWithStats[]>>({
        url: `/contests/my/active`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get active contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getMyPastContests(): Promise<PastContestWithStats[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<PastContestWithStats[]>>({
        url: `/contests/my/past`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get past contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async registerForContest(contestId: number): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/contests/${contestId}/register`
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

  async getContestTasksWithStatistics(contestId: number): Promise<{
    success: boolean;
    status: number;
    data?: ContestTaskWithStatistics[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestTaskWithStatistics[]>>({
        url: `/contests/${contestId}/tasks/user-statistics`
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

  async getContest(contestId: number): Promise<ContestDetailed> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestDetailed>>({
        url: `/contests/${contestId}`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestResults(contestId: number): Promise<{
    success: boolean;
    status: number;
    data?: ContestResults;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestResults>>({
        url: `/contests/${contestId}/results/my`
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
