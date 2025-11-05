import { query, form, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import type { Task } from '$lib/dto/task';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAssignableTasks = query(v.number(), async (contestId): Promise<Task[]> => {
  const { cookies, locals } = getRequestEvent();

  try {
    const contestService = createContestService(cookies, locals.user!.role);
    const tasks = await contestService.getAssignableTasks(contestId);

    return tasks;
  } catch (err) {
    console.error('Failed to load assignable tasks:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load assignable tasks');
  }
});

export const addTaskToContest = form(
  v.object({
    contestId: v.pipe(v.number(), v.minValue(1)),
    taskId: v.pipe(v.number(), v.minValue(1)),
    startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
    endAt: v.optional(v.string())
  }),
  async (data) => {
    const { cookies, locals } = getRequestEvent();

    try {
      const contestService = createContestService(cookies, locals.user!.role);
      const contestTask = await contestService.addTaskToContest(data.contestId, {
        taskId: data.taskId,
        startAt: data.startAt,
        endAt: data.endAt ?? null
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
