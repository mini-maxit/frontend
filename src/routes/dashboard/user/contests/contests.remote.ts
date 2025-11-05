import { query, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { UserContestsResponse } from '$lib/dto/contest';

export const getUserContests = query(async (): Promise<UserContestsResponse> => {
  const { cookies } = getRequestEvent();

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getMyContests();

    return {
      ongoing: contests.ongoing,
      upcoming: contests.upcoming,
      past: contests.past
    };
  } catch (err) {
    console.error('Failed to load user contests:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contests');
  }
});
