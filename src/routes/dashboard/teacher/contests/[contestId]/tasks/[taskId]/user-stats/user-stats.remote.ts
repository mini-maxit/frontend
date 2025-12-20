import { query, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { TaskUserStats } from '$lib/dto/contest';

const paramsSchema = v.object({
  contestId: v.number(),
  taskId: v.number()
});

export const getTaskUserStats = query(
  paramsSchema,
  async (params: { contestId: number; taskId: number }): Promise<TaskUserStats[]> => {
    const { cookies } = getRequestEvent();

    try {
      const svc = createContestsManagementService(cookies);
      return await svc.getTaskUserStats(params.contestId, params.taskId);
    } catch (err) {
      console.error('Failed to load task user stats:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load task user stats');
    }
  }
);
