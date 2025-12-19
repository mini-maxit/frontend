import { query, getRequestEvent } from '$app/server';
import { createContestsManagementService } from '$lib/services/ContestsManagementService';
import { createContestService } from '$lib/services/ContestService';
import { ApiError } from '$lib/services/ApiService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { UserContestStats, ContestDetailed } from '$lib/dto/contest';
import * as m from '$lib/paraglide/messages';

const contestResultsSchema = v.object({
  contestId: v.number()
});

export const getContestResults = query(
  contestResultsSchema,
  async (params: {
    contestId: number;
  }): Promise<{
    contest: ContestDetailed;
    userStats: UserContestStats[];
  }> => {
    const { cookies } = getRequestEvent();

    try {
      const contestsManagementService = createContestsManagementService(cookies);
      const contestService = createContestService(cookies);

      const [userStats, contest] = await Promise.all([
        contestsManagementService.getUserStats(params.contestId),
        contestService.getContest(params.contestId)
      ]);

      return {
        contest,
        userStats
      };
    } catch (err) {
      console.error('Failed to load contest results:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, m.contest_results_error_generic());
    }
  }
);
