import { ApiError, createApiClient } from './ApiService';
import type {
  CreatedContest,
  CreateContestDto,
  EditContestDto,
  RegistrationRequest,
  AddContestTaskDto,
  ContestTask
} from '$lib/dto/contest';
import type { Task } from '$lib/dto/task';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse, PaginatedData } from '$lib/dto/response';
import type { Submission, GetContestSubmissionsParams } from '$lib/dto/submission';
import { toRFC3339 } from '$lib/utils';

export class ContestsManagementService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getCreatedContests(): Promise<CreatedContest[]> {
    try {
      const contests = await this.apiClient.get<ApiResponse<PaginatedData<CreatedContest>>>({
        url: '/contests-management/contests/created'
      });

      return contests.data.items;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get created contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async createContest(data: CreateContestDto): Promise<{ id: number }> {
    try {
      const requestData = {
        ...data,
        startAt: toRFC3339(data.startAt),
        endAt: data.endAt ? toRFC3339(data.endAt) : null
      };

      const response = await this.apiClient.post<ApiResponse<{ id: number }>>({
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

  async updateContest(id: number, data: EditContestDto): Promise<CreatedContest> {
    try {
      const requestData = {
        ...data,
        startAt: toRFC3339(data.startAt),
        endAt: data.endAt ? toRFC3339(data.endAt) : null
      };

      const response = await this.apiClient.put<ApiResponse<CreatedContest>>({
        url: `/contests-management/contests/${id}`,
        body: JSON.stringify(requestData)
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to update contest:', error.toJSON());
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

  async getContestTasks(contestId: number): Promise<Task[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Task[]>>({
        url: `/contests-management/contests/${contestId}/tasks`
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

  async getContestSubmissions(
    contestId: number,
    params?: GetContestSubmissionsParams
  ): Promise<Submission[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.sort) queryParams.append('sort', params.sort);

      const url = `/contests-management/contests/${contestId}/submissions${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await this.apiClient.get<ApiResponse<PaginatedData<Submission>>>({
        url
      });
      return response.data.items;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contest submissions:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }
}

export function createContestsManagementService(cookies: Cookies): ContestsManagementService {
  return new ContestsManagementService(cookies);
}
