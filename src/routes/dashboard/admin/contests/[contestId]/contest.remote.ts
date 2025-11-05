import { query, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import type { UserContestTask } from '$lib/dto/task';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getContestTasks = query(
  v.number(),
  async (contestId: number): Promise<UserContestTask[]> => {
    const { cookies } = getRequestEvent();

    try {
      const contestService = createContestService(cookies);
      const tasks = await contestService.getContestTasks(contestId);

      return tasks;
    } catch (err) {
      console.error('Failed to load contest tasks:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load contest tasks');
    }
  }
);
