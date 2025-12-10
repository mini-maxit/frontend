import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TasksManagementService } from '$lib/services/TasksManagementService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

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

export const deleteTask = form(
  v.object({
    taskId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const tasksManagementService = new TasksManagementService(apiClient);

    const result = await tasksManagementService.deleteTask(data.taskId);

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to delete task' });
    }

    // Refresh tasks list
    await getTasks().refresh();

    return { success: true };
  }
);

export type DeleteTaskForm = typeof deleteTask;
