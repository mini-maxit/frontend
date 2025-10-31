import { query, form, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { ApiError } from '$lib/services/ApiService';
import type { Task } from '$lib/dto/task';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAllTasks = query(async (): Promise<Task[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.getAllTasks();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch tasks.' });
  }

  return result.data;
});

export const addTaskToContest = form(
  v.object({
    contestId: v.pipe(v.number(), v.minValue(1)),
    taskId: v.pipe(v.number(), v.minValue(1)),
    startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
    endAt: v.pipe(v.string(), v.nonEmpty('End date is required'))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const contestService = createContestService(cookies);
      const contestTask = await contestService.addTaskToContest(data.contestId, {
        taskId: data.taskId,
        startAt: data.startAt,
        endAt: data.endAt
      });

      return { success: true, contestTask };
    } catch (err) {
      console.error('Failed to add task to contest:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to add task to contest');
    }
  }
);

export type AddTaskToContestForm = typeof addTaskToContest;
