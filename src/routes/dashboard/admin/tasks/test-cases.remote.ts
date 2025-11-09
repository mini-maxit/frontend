import * as v from 'valibot';
import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TasksManagementService } from '$lib/services/TasksManagementService';
import { error } from '@sveltejs/kit';

const TaskLimitSchema = v.object({
  order: v.number(),
  memoryLimit: v.pipe(v.number(), v.minValue(1), v.maxValue(131072)),
  timeLimit: v.pipe(v.number(), v.minValue(1), v.maxValue(30000))
});

const UpdateTaskLimitsSchema = v.object({
  taskId: v.number(),
  limits: v.array(TaskLimitSchema)
});

export const getTaskLimits = query(v.number(), async (taskId) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const tasksManagementService = new TasksManagementService(apiClient);

  const result = await tasksManagementService.getTaskLimits(taskId);
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch task limits.' });
  }

  return result.data;
});

export const updateTaskLimits = form(UpdateTaskLimitsSchema, async (data) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const tasksManagementService = new TasksManagementService(apiClient);

  const result = await tasksManagementService.updateTaskLimits(data.taskId, {
    limits: data.limits
  });

  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to update task limits.' });
  }

  await getTaskLimits(data.taskId).refresh();

  return { success: true, data: result.data };
});
