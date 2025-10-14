import { query } from '$app/server';
import { createContestService } from '$lib/services/ContestService';
import { getRequestEvent } from '$app/server';
import type { ContestWithStatus } from '$lib/dto/contest';
import { transformContestData } from '$lib/utils/contest';

export const getContests = query(async (): Promise<ContestWithStatus[]> => {
  const event = getRequestEvent();
  const contestService = createContestService(event.cookies);

  const contests = await contestService.getContests();
  return contests.map(transformContestData);
});
