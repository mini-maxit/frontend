import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { error } from '@sveltejs/kit';
import type { Task } from '$lib/dto/task';

export const getTasks = query(async (): Promise<Task[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.getAllTasks();
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to fetch tasks.' });
  }

  return result.data || [];
});
