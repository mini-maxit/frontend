import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { ResourceType } from '$lib/dto/accessControl';

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

  // Verify contest exists by checking if we can access collaborators
  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);
  const result = await accessControlService.getCollaborators(ResourceType.Contests, contestId);

  if (!result.success) {
    if (result.status === 404) {
      throw error(404, 'Contest not found');
    }
    // For other errors (like 403 forbidden), we still allow access to the layout
    // The collaborators page will handle the error display
  }

  return {
    contestId,
    currentUserId: parentData.user.userId
  };
};
