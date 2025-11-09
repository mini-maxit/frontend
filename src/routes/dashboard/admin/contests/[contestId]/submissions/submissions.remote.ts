import { query, getRequestEvent } from '$app/server';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getContestSubmissions = query(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    limit: v.optional(v.pipe(v.number(), v.integer())),
    offset: v.optional(v.pipe(v.number(), v.integer())),
    sort: v.optional(v.string())
  }),
  async (params) => {
    const { cookies } = getRequestEvent();

    try {
      const contestsManagementService = createContestsManagementService(cookies);
      const submissions = await contestsManagementService.getContestSubmissions(params.contestId, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort
      });

      return submissions;
    } catch (err) {
      console.error('Failed to load contest submissions:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load contest submissions');
    }
  }
);
