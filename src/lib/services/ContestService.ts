import { ApiError, createApiClient } from './ApiService';
import type {
  Contest,
  UserContestsResponse,
  CreateContestDto,
  RegistrationRequest,
  AddContestTaskDto,
  ContestTask
} from '$lib/dto/contest';
import type { Task, UserContestTask, ContestTaskWithStatistics } from '$lib/dto/task';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/dto/response';
import { toRFC3339 } from '$lib/utils';
import { UserRole } from '$lib/dto/jwt';

export class ContestService {
  private apiClient;
  private userRole: UserRole;

  constructor(cookies: Cookies, userRole: UserRole) {
    this.apiClient = createApiClient(cookies);
    this.userRole = userRole;
  }

  /**
   * Get all contests accessible to the user based on their role
   * For students: returns contests they can see/register for
   * For teachers/admins: returns contests they manage
   */
  async getAllContests(): Promise<Contest[]> {
    try {
      const baseUrl =
        this.userRole === UserRole.Student ? '/student/contests' : '/teacher/contests';
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: baseUrl
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  /**
   * Get contests filtered by status (only for students)
   * For teachers, use getAllContests() instead
   */
  async getContestsByStatus(status?: 'ongoing' | 'upcoming' | 'past'): Promise<Contest[]> {
    try {
      if (this.userRole !== UserRole.Student) {
        console.warn(
          'getContestsByStatus should only be used for students. Use getAllContests() for teachers.'
        );
        return this.getAllContests();
      }

      const url = status ? `/student/contests?sort=${status}` : '/student/contests';
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get contests by status:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  /**
   * @deprecated Use getContestsByStatus('ongoing') instead
   */
  async getOngoing(): Promise<Contest[]> {
    return this.getContestsByStatus('ongoing');
  }

  /**
   * @deprecated Use getContestsByStatus('upcoming') instead
   */
  async getUpcoming(): Promise<Contest[]> {
    return this.getContestsByStatus('upcoming');
  }

  /**
   * @deprecated Use getContestsByStatus('past') instead
   */
  async getPast(): Promise<Contest[]> {
    return this.getContestsByStatus('past');
  }

  /**
   * @deprecated Use getAllContests() or getContestsByStatus() instead
   * Note: The new API does not provide solvedTaskCount, so this will return 0 for that field
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserContests(_userId: number): Promise<UserContestsResponse> {
    try {
      // For backward compatibility, fetch all contests and group by status
      // Note: This is inefficient and should be replaced with proper usage of new endpoints
      const contests = await this.getAllContests();

      // Group contests by status and map to UserContest format
      // Note: solvedTaskCount is not available in the new API, defaulting to 0
      const mapToUserContest = (contest: Contest) => ({
        ...contest,
        solvedTaskCount: 0 // Not available in new API
      });

      const ongoing = contests.filter((c) => c.status === 'ongoing').map(mapToUserContest);
      const upcoming = contests.filter((c) => c.status === 'upcoming').map(mapToUserContest);
      const past = contests.filter((c) => c.status === 'past').map(mapToUserContest);

      return { ongoing, upcoming, past };
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
        url: `/student/contests/${contestId}/register`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to register for contest:', error.toJSON());
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
        url: '/teacher/contests',
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
        url: `/teacher/contests/${contestId}/registration-requests?status=${status}`
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
        url: `/teacher/contests/${contestId}/registration-requests/${userId}/approve`
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
        url: `/teacher/contests/${contestId}/registration-requests/${userId}/reject`
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
        url: `/teacher/contests/${contestId}/tasks/assignable-tasks`
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
        url: `/teacher/contests/${contestId}/tasks`,
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
      const baseUrl =
        this.userRole === UserRole.Student
          ? `/student/contests/${contestId}/tasks`
          : `/teacher/contests/${contestId}/tasks`;

      const response = await this.apiClient.get<ApiResponse<UserContestTask[]>>({
        url: baseUrl
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
        url: `/student/contests/${contestId}/task-progress`
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

  /**
   * Fetches a specific task within a contest by first getting all contest tasks
   * and filtering for the requested task ID.
   *
   * Note: This implementation fetches all tasks which may be inefficient for contests
   * with many tasks. Consider adding a dedicated API endpoint `/student/contests/{contestId}/tasks/{taskId}`
   * or `/teacher/contests/{contestId}/tasks/{taskId}` for better performance.
   */
  async getContestTask(contestId: number, taskId: number): Promise<UserContestTask> {
    try {
      const tasks = await this.getContestTasks(contestId);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        const baseUrl =
          this.userRole === UserRole.Student
            ? `/student/contests/${contestId}/tasks`
            : `/teacher/contests/${contestId}/tasks`;
        throw new ApiError(404, 'Not Found', baseUrl, 'GET', {
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

export function createContestService(cookies: Cookies, userRole: UserRole): ContestService {
  return new ContestService(cookies, userRole);
}
