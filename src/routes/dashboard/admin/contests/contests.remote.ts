import { query, form, getRequestEvent } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import type { Contest } from '$lib/dto/contest';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAllContests = query(async (): Promise<Contest[]> => {
  const { cookies } = getRequestEvent();

  try {
    const contestService = createContestService(cookies);
    const contests = await contestService.getCreatedContests();

    return contests;
  } catch (err) {
    console.error('Failed to load all contests:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contests');
  }
});

export const createContest = form(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty('Contest name is required')),
    description: v.pipe(v.string(), v.nonEmpty('Description is required')),
    startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
    endAt: v.optional(v.string()),
    isRegistrationOpen: v.optional(v.boolean(), true),
    isSubmissionOpen: v.optional(v.boolean(), true),
    isVisible: v.optional(v.boolean(), true)
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const contestService = createContestService(cookies);
      const contest = await contestService.createContest({
        ...data,
        endAt: data.endAt ?? null
      });

      // Refresh the contests list
      await getAllContests().refresh();

      return { success: true, contest };
    } catch (err) {
      console.error('Failed to create contest:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to create contest');
    }
  }
);

export type CreateContestForm = typeof createContest;
