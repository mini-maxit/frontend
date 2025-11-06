import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TasksManagementService } from '$lib/services/TasksManagementService';
import { error } from '@sveltejs/kit';

export const getTasks = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const tasksManagementService = new TasksManagementService(apiClient);

  const result = await tasksManagementService.getCreatedTasks();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch tasks.' });
  }

  return result.data;
});
