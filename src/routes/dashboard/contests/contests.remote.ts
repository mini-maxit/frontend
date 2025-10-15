import { query, command } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { getRequestEvent } from '$app/server';
import type { ContestWithStatus, ContestsResponse } from '$lib/dto/contest';
import { transformContestData } from '$lib/utils/contest';
import * as v from 'valibot';

export const getOngoingContests = query(async (): Promise<ContestWithStatus[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);

  const response = await apiClient.get<ContestsResponse>({
    url: '/contest/ongoing'
  });

  return response.data.map((contest) =>
    transformContestData({ ...contest, status: 'live' as const })
  );
});

export const getUpcomingContests = query(async (): Promise<ContestWithStatus[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);

  const response = await apiClient.get<ContestsResponse>({
    url: '/contest/upcoming'
  });

  return response.data.map((contest) =>
    transformContestData({ ...contest, status: 'upcoming' as const })
  );
});

export const getPastContests = query(async (): Promise<ContestWithStatus[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);

  const response = await apiClient.get<ContestsResponse>({
    url: '/contest/past'
  });

  return response.data.map((contest) =>
    transformContestData({ ...contest, status: 'past' as const })
  );
});

export const registerForContest = command(v.number(), async (contestId: number) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);

  try {
    const response = await apiClient.post({
      url: `/contest/${contestId}/register`
    });

    // Refresh all contest queries to update registration status
    await getOngoingContests().refresh();
    await getUpcomingContests().refresh();
    await getPastContests().refresh();

    return { success: true, data: response };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
});
