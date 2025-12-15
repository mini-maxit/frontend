import { error } from '@sveltejs/kit';
import { createContestService } from '$lib/services/ContestService';
import * as m from '$lib/paraglide/messages';

export const load = async ({
  params,
  parent,
  cookies
}: {
  params: { contestId: string };
  parent: () => Promise<{ user: { userId: number; role: string } }>;
  cookies: import('@sveltejs/kit').Cookies;
}) => {
  const contestId = parseInt(params.contestId, 10);

  if (isNaN(contestId)) {
    throw error(400, m.contest_results_invalid_contest_id());
  }

  const parentData = await parent();
  const user = parentData.user;

  // Fetch contest details
  const contestService = createContestService(cookies);
  const contest = await contestService.getContest(contestId);

  return {
    contestId,
    currentUserId: user.userId,
    contest
  };
};
