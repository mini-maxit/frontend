import { query, getRequestEvent } from '$app/server';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { UserContestStats, ContestResults, ContestDetailed } from '$lib/dto/contest';

const contestResultsSchema = v.object({
  contestId: v.number(),
  contest: v.any()
});

export const getContestResults = query(
  contestResultsSchema,
  async (params: {
    contestId: number;
    contest: ContestDetailed;
  }): Promise<{
    contest: ContestDetailed;
    leaderboard: UserContestStats[];
    myResults: ContestResults;
  }> => {
    const { cookies } = getRequestEvent();

    try {
      const contestsManagementService = createContestsManagementService(cookies);
      const contestService = createContestService(cookies);

      const [leaderboard, myResults] = await Promise.all([
        contestsManagementService.getUserStats(params.contestId),
        contestService.getMyResults(params.contestId)
      ]);

      return {
        contest: params.contest,
        leaderboard,
        myResults
      };
    } catch (err) {
      console.error('Failed to load contest results:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to load contest results');
    }
  }
);
