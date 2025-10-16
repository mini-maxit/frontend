import { query } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { UserContestsResponse } from '$lib/dto/contest';

export const getUserContests = query(async (): Promise<UserContestsResponse> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getUserContests(locals.user.userId);

    // Ensure we return a valid UserContestsResponse structure
    if (!contests || typeof contests !== 'object') {
      return {
        ongoing: [],
        upcoming: [],
        past: []
      };
    }

    return {
      ongoing: contests.ongoing || [],
      upcoming: contests.upcoming || [],
      past: contests.past || []
    };
  } catch (err) {
    console.error('Failed to load user contests:', err);
    throw error(500, 'Failed to load contests');
  }
});
