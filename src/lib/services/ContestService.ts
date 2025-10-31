import { ApiError, createApiClient } from './ApiService';
import type {
  Contest,
  UserContestsResponse,
  CreateContestDto,
  RegistrationRequest
} from '$lib/dto/contest';
import type { ContestTask } from '$lib/dto/task';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/dto/response';
import { toRFC3339 } from '$lib/utils';

export class ContestService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getOngoing(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contests/ongoing'
      });
      return response.data;
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
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contests/upcoming'
      });
      return response.data;
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
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contests/past'
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

  async getUserContests(userId: number): Promise<UserContestsResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserContestsResponse>>({
        url: `/users/${userId}/contests`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get user contests:', error.toJSON());
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

  async getAllContests(): Promise<Contest[]> {
    try {
      const [ongoing, upcoming, past] = await Promise.all([
        this.getOngoing(),
        this.getUpcoming(),
        this.getPast()
      ]);

      return [...ongoing, ...upcoming, ...past];
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get all contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async createContest(data: CreateContestDto): Promise<Contest> {
    try {
      const requestData = {
        ...data,
        startAt: toRFC3339(data.startAt),
        endAt: data.endAt ? toRFC3339(data.endAt) : null
      };

      const response = await this.apiClient.post<ApiResponse<Contest>>({
        url: '/contests/',
        body: JSON.stringify(requestData)
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to create contest:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getRegistrationRequests(
    contestId: number,
    status: string = 'pending'
  ): Promise<RegistrationRequest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<RegistrationRequest[]>>({
        url: `/contests/${contestId}/registration-requests?status=${status}`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get registration requests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async approveRegistrationRequest(contestId: number, userId: number): Promise<void> {
    try {
      await this.apiClient.post<ApiResponse<{ message: string }>>({
        url: `/contests/${contestId}/registration-requests/${userId}/approve`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to approve registration request:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async rejectRegistrationRequest(contestId: number, userId: number): Promise<void> {
    try {
      await this.apiClient.post<ApiResponse<{ message: string }>>({
        url: `/contests/${contestId}/registration-requests/${userId}/reject`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to reject registration request:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestTasks(contestId: number): Promise<ContestTask[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<ContestTask[]>>({
        url: `/contests/${contestId}/tasks`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest tasks:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestTask(contestId: number, taskId: number): Promise<ContestTask> {
    try {
      const tasks = await this.getContestTasks(contestId);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new ApiError(404, 'Not Found', `/contests/${contestId}/tasks`, 'GET', {
          data: { code: 'NOT_FOUND', message: 'Task not found in contest' }
        });
      }
      return task;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest task:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
