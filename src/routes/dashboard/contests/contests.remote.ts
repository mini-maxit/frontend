import { query, command, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import type { Contest } from '$lib/dto/contest';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getOngoingContests = query(async (): Promise<Contest[]> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getOngoing();

    return contests;
  } catch (err) {
    console.error('Failed to load ongoing contests:', err);

    if (err instanceof ApiError) {
      if (err.getStatus() === 401) {
        throw error(401, 'Unauthorized');
      }
      if (err.getStatus() === 403) {
        throw error(403, 'Forbidden');
      }
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load ongoing contests');
  }
});

export const getUpcomingContests = query(async (): Promise<Contest[]> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getUpcoming();

    return contests;
  } catch (err) {
    console.error('Failed to load upcoming contests:', err);

    if (err instanceof ApiError) {
      if (err.getStatus() === 401) {
        throw error(401, 'Unauthorized');
      }
      if (err.getStatus() === 403) {
        throw error(403, 'Forbidden');
      }
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load upcoming contests');
  }
});

export const getPastContests = query(async (): Promise<Contest[]> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getPast();

    return contests;
  } catch (err) {
    console.error('Failed to load past contests:', err);

    if (err instanceof ApiError) {
      if (err.getStatus() === 401) {
        throw error(401, 'Unauthorized');
      }
      if (err.getStatus() === 403) {
        throw error(403, 'Forbidden');
      }
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load past contests');
  }
});

export const registerForContest = command(v.number(), async (contestId: number) => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const contestService = createContestService(cookies);
    await contestService.registerForContest(contestId);

    return { success: true };
  } catch (err) {
    console.error('Failed to register for contest:', err);

    if (err instanceof ApiError) {
      // Map specific API errors to appropriate HTTP status codes
      if (err.getStatus() === 401) {
        throw error(401, 'Unauthorized');
      }
      if (err.getStatus() === 403) {
        throw error(403, 'Registration not allowed');
      }
      if (err.getStatus() === 404) {
        throw error(404, 'Contest not found');
      }
      if (err.getStatus() === 409) {
        throw error(409, 'Already registered for this contest');
      }
      if (err.getStatus() === 422) {
        throw error(422, 'Registration period has ended');
      }
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to register for contest');
  }
});
