import { query, getRequestEvent } from '$app/server';
import { createTaskService } from '$lib/services/TaskService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { MyTasksResponse } from '$lib/dto/task';

export const getMyTasks = query(async (): Promise<MyTasksResponse> => {
  const { cookies } = getRequestEvent();

  try {
    const taskService = createTaskService(cookies);
    const result = await taskService.getMyTasks({ limit: 100, offset: 0 });

    if (!result.success || !result.data) {
      throw error(result.status, result.error || 'Failed to fetch tasks');
    }

    return result.data;
  } catch (err) {
    console.error('Failed to load user tasks:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load tasks');
  }
});
