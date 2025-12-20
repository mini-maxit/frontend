import { query, form, getRequestEvent } from '$app/server';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import type { CreatedContest } from '$lib/dto/contest';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAllContests = query(async (): Promise<CreatedContest[]> => {
  const { cookies } = getRequestEvent();

  try {
    const contestsManagementService = createContestsManagementService(cookies);
    const contests = await contestsManagementService.getManagedContests();

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
    isRegistrationOpen: v.optional(v.boolean(), false),
    isSubmissionOpen: v.optional(v.boolean(), false),
    isVisible: v.optional(v.boolean(), false)
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const contestsManagementService = createContestsManagementService(cookies);
      const contest = await contestsManagementService.createContest({
        ...data,
        endAt: data.endAt ? data.endAt : null
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

export const updateContest = form(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    name: v.pipe(v.string(), v.nonEmpty('Contest name is required')),
    description: v.pipe(v.string(), v.nonEmpty('Description is required')),
    startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
    endAt: v.optional(v.string()),
    isRegistrationOpen: v.optional(v.boolean(), false),
    isSubmissionOpen: v.optional(v.boolean(), false),
    isVisible: v.optional(v.boolean(), false)
  }),
  async (data) => {
    console.log('Updating contest with data:', data);

    const { cookies } = getRequestEvent();

    try {
      const contestsManagementService = createContestsManagementService(cookies);
      const { id, ...contestData } = data;
      const contest = await contestsManagementService.updateContest(id, {
        ...contestData,
        endAt: contestData.endAt ? contestData.endAt : null
      });

      // Refresh the contests list
      await getAllContests().refresh();

      return { success: true, contest };
    } catch (err) {
      console.error('Failed to update contest:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to update contest');
    }
  }
);

export type UpdateContestForm = typeof updateContest;
