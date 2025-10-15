import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { error } from '@sveltejs/kit';

export const getTasks = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.getAllTasks();
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to fetch tasks.' });
  }

  return result.data || [];
});
