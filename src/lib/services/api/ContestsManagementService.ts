import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type {
	CreatedContest,
	CreateContestDto,
	EditContestDto,
	RegistrationRequest,
	AddContestTaskDto,
	ContestTask as ContestTaskRelation,
	ManagedContest,
	UserContestStats,
	TaskUserStats
} from '$lib/dto/contest';
import type { Task, ContestTask } from '$lib/dto/task';
import type { Group } from '$lib/dto/group';
import type { ApiResponse, PaginatedData } from '$lib/dto/response';
import type { Submission, GetContestSubmissionsParams } from '$lib/dto/submission';

/**
 * Client-side service for contest management API calls
 * Mirrors the server-side ContestsManagementService API (throws errors)
 */
export class ContestsManagementService {
	constructor(private apiClient: ApiService) {}

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

	async getManagedContests(): Promise<ManagedContest[]> {
		try {
			const contests = await this.apiClient.get<ApiResponse<PaginatedData<ManagedContest>>>({
				url: '/contests-management/contests/managed'
			});
			return contests.data.items;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get managed contests:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async createContest(data: CreateContestDto): Promise<{ id: number }> {
		try {
			const requestData = {
				...data,
				startAt: data.startAt,
				endAt: data.endAt ? data.endAt : null
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
				startAt: data.startAt,
				endAt: data.endAt ? data.endAt : null
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

	async addTaskToContest(contestId: number, data: AddContestTaskDto): Promise<ContestTaskRelation> {
		try {
			const requestData = {
				taskId: data.taskId,
				startAt: data.startAt,
				endAt: data.endAt ? data.endAt : null
			};
			const response = await this.apiClient.post<ApiResponse<ContestTaskRelation>>({
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

	async removeTaskFromContest(contestId: number, taskIds: number[]): Promise<void> {
		try {
			const requestData = {
				taskIds
			};
			await this.apiClient.delete<ApiResponse<{ message: string }>>({
				url: `/contests-management/contests/${contestId}/tasks`,
				body: JSON.stringify(requestData)
			});
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to remove task from contest:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async getContestTasks(contestId: number): Promise<ContestTask[]> {
		try {
			const response = await this.apiClient.get<ApiResponse<ContestTask[]>>({
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
	): Promise<PaginatedData<Submission>> {
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
			return response.data;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get contest submissions:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async getUserStats(contestId: number, userId?: number): Promise<UserContestStats[]> {
		try {
			const queryParams = new URLSearchParams();
			if (userId) queryParams.append('userId', userId.toString());

			const url = `/contests-management/contests/${contestId}/user-stats${
				queryParams.toString() ? `?${queryParams.toString()}` : ''
			}`;

			const response = await this.apiClient.get<ApiResponse<UserContestStats[]>>({
				url
			});
			return response.data;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get contest user stats:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async getTaskUserStats(contestId: number, taskId: number): Promise<TaskUserStats[]> {
		try {
			const url = `/contests-management/contests/${contestId}/tasks/${taskId}/user-stats`;

			const response = await this.apiClient.get<ApiResponse<TaskUserStats[]>>({
				url
			});
			return response.data;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get task user stats:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async getContestGroups(contestId: number): Promise<Group[]> {
		try {
			const response = await this.apiClient.get<ApiResponse<Group[]>>({
				url: `/contests-management/contests/${contestId}/groups`
			});
			return response.data;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get contest groups:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async getAssignableGroups(contestId: number): Promise<Group[]> {
		try {
			const response = await this.apiClient.get<ApiResponse<Group[]>>({
				url: `/contests-management/contests/${contestId}/groups/assignable`
			});
			return response.data;
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to get assignable groups:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async addGroupsToContest(contestId: number, groupIds: number[]): Promise<void> {
		try {
			await this.apiClient.post<ApiResponse<{ message: string }>>({
				url: `/contests-management/contests/${contestId}/groups`,
				body: JSON.stringify({ groupIds })
			});
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to add groups to contest:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}

	async removeGroupsFromContest(contestId: number, groupIds: number[]): Promise<void> {
		try {
			await this.apiClient.delete<ApiResponse<{ message: string }>>({
				url: `/contests-management/contests/${contestId}/groups`,
				body: JSON.stringify({ groupIds })
			});
		} catch (error) {
			if (error instanceof ApiError) {
				console.error('Failed to remove groups from contest:', error.toJSON());
				throw error;
			}
			throw error;
		}
	}
}
