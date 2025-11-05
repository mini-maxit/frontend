import { ApiError, createApiClient } from './ApiService';
import type {
  Contest,
  UserContestsResponse,
  CreateContestDto,
  RegistrationRequest,
  AddContestTaskDto,
  ContestTask
} from '$lib/dto/contest';
import type { Task, UserContestTask, ContestTaskWithStatistics, TaskDetail } from '$lib/dto/task';
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
        url: '/contests?status=ongoing'
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
        url: '/contests?status=upcoming'
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
        url: '/contests?status=past'
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

  async getMyContests(): Promise<UserContestsResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserContestsResponse>>({
        url: `/contests/my`
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

  async getCreatedContests(): Promise<Contest[]> {
    try {
      const contests = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contests-management/contests/created'
      });

      return contests.data;
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
        url: '/contests-management/contests',
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
        url: `/contests-management/contests/${contestId}/registration-requests?status=${status}`
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
        url: `/contests-management/contests/${contestId}/registration-requests/${userId}/approve`
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
        url: `/contests-management/contests/${contestId}/registration-requests/${userId}/reject`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to reject registration request:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getAssignableTasks(contestId: number): Promise<Task[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Task[]>>({
        url: `/contests-management/contests/${contestId}/tasks/assignable-tasks`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get assignable tasks:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async addTaskToContest(contestId: number, data: AddContestTaskDto): Promise<ContestTask> {
    try {
      const requestData = {
        taskId: data.taskId,
        startAt: toRFC3339(data.startAt),
        endAt: data.endAt ? toRFC3339(data.endAt) : null
      };

      const response = await this.apiClient.post<ApiResponse<ContestTask>>({
        url: `/contests-management/contests/${contestId}/tasks`,
        body: JSON.stringify(requestData)
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to add task to contest:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getContestTasks(contestId: number): Promise<UserContestTask[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserContestTask[]>>({
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
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
