import { query, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { ContestTaskWithStatistics } from '$lib/dto/task';

export const getContestTasksWithStatistics = query(
  v.number(),
  async (contestId: number): Promise<ContestTaskWithStatistics[]> => {
    const { cookies, locals } = getRequestEvent();

    try {
      const contestService = createContestService(cookies, locals.user!.role);
      const tasks = await contestService.getContestTasksWithStatistics(contestId);

      return tasks;
    } catch (err) {
      console.error('Failed to load contest tasks with statistics:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load contest tasks');
    }
  }
);
