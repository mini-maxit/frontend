import { query, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import type { ContestWithStats, PastContestWithStats } from '$lib/dto/contest';

export interface UserContestsData {
  active: ContestWithStats[];
  past: PastContestWithStats[];
}

export const getUserContests = query(async (): Promise<UserContestsData> => {
  const { cookies } = getRequestEvent();

  try {
    const contestService = createContestService(cookies);

    const [active, past] = await Promise.all([
      contestService.getMyActiveContests(),
      contestService.getMyPastContests()
    ]);

    return {
      active,
      past
    };
  } catch (err) {
    console.error('Failed to load user contests:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contests');
  }
});
