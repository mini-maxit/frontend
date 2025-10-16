import { query, command, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import type { Contest } from '$lib/dto/contest';
import * as v from 'valibot';
import { ContestService } from '$lib/services/ContestService';

export const getOngoingContests = query(async (): Promise<Contest[]> => {
  const event = getRequestEvent();

  const contestService = new ContestService(event.cookies);
  const response = await contestService.getOngoing();
  return response;
});

export const getUpcomingContests = query(async (): Promise<Contest[]> => {
  const event = getRequestEvent();
  const contestService = new ContestService(event.cookies);

  const response = await contestService.getUpcoming();
  return response;
});

export const getPastContests = query(async (): Promise<Contest[]> => {
  const event = getRequestEvent();

  const contestService = new ContestService(event.cookies);
  const response = await contestService.getPast();
  return response;
});

export const registerForContest = command(v.number(), async (contestId: number) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);

  try {
    const response = await apiClient.post({
      url: `/contest/${contestId}/register`
    });

    // Registration successful; client will update caches optimistically

    return { success: true, data: response };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
});
