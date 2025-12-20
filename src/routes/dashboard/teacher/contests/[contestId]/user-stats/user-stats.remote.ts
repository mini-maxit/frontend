import { query, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { UserContestStats } from '$lib/dto/contest';

const paramsSchema = v.object({
  contestId: v.number()
});

export const getContestUserStats = query(
  paramsSchema,
  async (params: { contestId: number }): Promise<UserContestStats[]> => {
    const { cookies } = getRequestEvent();

    try {
      const svc = createContestsManagementService(cookies);
      return await svc.getUserStats(params.contestId);
    } catch (err) {
      console.error('Failed to load contest user stats:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load contest user stats');
    }
  }
);
