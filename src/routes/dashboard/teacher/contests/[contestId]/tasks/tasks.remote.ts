import { query, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';

export const getContestTasks = query(v.number(), async (contestId: number) => {
  const { cookies } = getRequestEvent();

  try {
    const svc = createContestsManagementService(cookies);
    return await svc.getContestTasks(contestId);
  } catch (err) {
    console.error('Failed to load contest tasks:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contest tasks');
  }
});
