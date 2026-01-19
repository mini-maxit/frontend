import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type { ApiResponse, PaginatedData } from '$lib/dto/response';
import type {
	Task,
	UploadTaskResponse,
	UploadTaskDto,
	TaskLimit,
	UpdateTaskLimitsDto
} from '$lib/dto/task';
import { RequestContentType } from '$lib/dto/request';

/**
 * Client-side service for task management API calls
 * Mirrors the server-side TasksManagementService API
 */
export class TasksManagementService {
	constructor(private apiClient: ApiService) {}

	async uploadTask(
		body: UploadTaskDto
	): Promise<{ success: boolean; status: number; data?: UploadTaskResponse; error?: string }> {
		const formData = new FormData();
		formData.append('title', body.title);
		formData.append('archive', body.archive);
		formData.append('isVisible', body.isVisible.toString());

		try {
			const response = await this.apiClient.post<ApiResponse<UploadTaskResponse>>({
				url: '/tasks-management/tasks',
				body: formData
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

	async getCreatedTasks(): Promise<{
		success: boolean;
		status: number;
		data?: Task[];
		error?: string;
	}> {
		try {
			const response = await this.apiClient.get<ApiResponse<PaginatedData<Task>>>({
				url: '/tasks-management/tasks/created'
			});
			return { success: true, data: response.data.items, status: 200 };
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

	async getTaskLimits(taskId: number): Promise<{
		success: boolean;
		status: number;
		data?: TaskLimit[];
		error?: string;
	}> {
		try {
			const response = await this.apiClient.get<ApiResponse<TaskLimit[]>>({
				url: `/tasks-management/tasks/${taskId}/limits`
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

	async updateTaskLimits(
		taskId: number,
		body: UpdateTaskLimitsDto
	): Promise<{
		success: boolean;
		status: number;
		data?: TaskLimit[];
		error?: string;
	}> {
		try {
			const response = await this.apiClient.put<ApiResponse<TaskLimit[]>>({
				url: `/tasks-management/tasks/${taskId}/limits`,
				body: JSON.stringify(body),
				contentType: RequestContentType.Json
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

	async toggleTaskVisibility(
		taskId: number,
		isVisible: boolean
	): Promise<{ success: boolean; status: number; error?: string }> {
		const formData = new FormData();
		formData.append('isVisible', isVisible.toString());

		try {
			await this.apiClient.patch<ApiResponse<void>>({
				url: `/tasks-management/tasks/${taskId}`,
				body: formData
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

	async deleteTask(taskId: number): Promise<{
		success: boolean;
		status: number;
		error?: string;
	}> {
		try {
			await this.apiClient.delete<ApiResponse<void>>({
				url: `/tasks-management/tasks/${taskId}`
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
