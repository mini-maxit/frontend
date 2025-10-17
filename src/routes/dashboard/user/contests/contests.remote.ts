import { query, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { UserContestsResponse } from '$lib/dto/contest';

export const getUserContests = query(async (): Promise<UserContestsResponse> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getUserContests(locals.user.userId);

    // Handle empty or invalid response by returning default structure
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

    if (err instanceof ApiError) {
      // Map specific API errors to appropriate HTTP status codes
      if (err.getStatus() === 404) {
        // User has no contests, return empty structure
        return {
          ongoing: [],
          upcoming: [],
          past: []
        };
      }
      if (err.getStatus() === 401) {
        throw error(401, 'Unauthorized');
      }
      if (err.getStatus() === 403) {
        throw error(403, 'Forbidden');
      }
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contests');
  }
});
