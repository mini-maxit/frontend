import { error } from '@sveltejs/kit';
import { createContestService } from '$lib/services/ContestService';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { UserRole } from '$lib/dto/jwt';
import { ContestStatus } from '$lib/dto/contest';

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
    throw error(400, 'Invalid contest ID');
  }

  const parentData = await parent();
  const user = parentData.user;

  // Fetch contest details to check status
  const contestService = createContestService(cookies);
  const contest = await contestService.getContest(contestId);

  // Check access: contest must be past OR user is admin/teacher with access
  const isAdmin = user.role === UserRole.Admin;
  const isTeacher = user.role === UserRole.Teacher;
  const isContestPast = contest.status === ContestStatus.Past;

  if (!isContestPast) {
    // If contest is not past, only admin or teacher with access can view
    if (!isAdmin && !isTeacher) {
      throw error(403, 'Results are only available after the contest has ended');
    }

    // For teachers, verify they have access to this contest
    if (isTeacher) {
      const apiClient = createApiClient(cookies);
      const accessControlService = new AccessControlService(apiClient);
      const result = await accessControlService.getContestCollaborators(contestId);

      if (!result.success) {
        throw error(403, 'Results are only available after the contest has ended');
      }
    }
  }

  return {
    contestId,
    currentUserId: user.userId
  };
};
