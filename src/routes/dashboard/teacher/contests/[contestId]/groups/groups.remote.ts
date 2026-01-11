import { query, command, getRequestEvent } from '$app/server';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { ApiError } from '$lib/services/ApiService';
import type { Group } from '$lib/dto/group';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getContestGroups = query(v.number(), async (contestId: number): Promise<Group[]> => {
  const { cookies } = getRequestEvent();

  try {
    const contestsService = createContestsManagementService(cookies);
    return await contestsService.getContestGroups(contestId);
  } catch (err) {
    console.error('Failed to load contest groups:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load contest groups');
  }
});

export const getAssignableGroups = query(
  v.number(),
  async (contestId: number): Promise<Group[]> => {
    const { cookies } = getRequestEvent();

    try {
      const contestsService = createContestsManagementService(cookies);
      return await contestsService.getAssignableGroups(contestId);
    } catch (err) {
      console.error('Failed to load assignable groups:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load assignable groups');
    }
  }
);

export const addGroupsToContest = command(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    groupIds: v.array(v.pipe(v.number(), v.integer()))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const contestsService = createContestsManagementService(cookies);
      await contestsService.addGroupsToContest(data.contestId, data.groupIds);

      // Refresh contest groups
      await getContestGroups(data.contestId).refresh();

      return { success: true };
    } catch (err) {
      console.error('Failed to add groups to contest:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to add groups to contest');
    }
  }
);

export const removeGroupsFromContest = command(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    groupIds: v.array(v.pipe(v.number(), v.integer()))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const contestsService = createContestsManagementService(cookies);
      await contestsService.removeGroupsFromContest(data.contestId, data.groupIds);

      // Refresh contest groups
      await getContestGroups(data.contestId).refresh();

      return { success: true };
    } catch (err) {
      console.error('Failed to remove groups from contest:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to remove groups from contest');
    }
  }
);
