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

  async registerForContest(contestId: number): Promise<void> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/contests/${contestId}/register`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to register for contest:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestTasksWithStatistics(contestId: number): Promise<ContestTaskWithStatistics[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestTaskWithStatistics[]>>({
        url: `/contests/${contestId}/tasks/user-statistics`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest tasks with statistics:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestTask(contestId: number, taskId: number): Promise<TaskDetail> {
    try {
      const response = await this.apiClient.get<ApiResponse<TaskDetail>>({
        url: `/contests/${contestId}/tasks/${taskId}`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest task:', error.toJSON());
        throw error;
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

  async getMyResults(contestId: number): Promise<ContestResults> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestResults>>({
        url: `/contests/${contestId}/results/my`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest results:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }
}
