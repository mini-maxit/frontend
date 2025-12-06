import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';

export const load = async ({
  params,
  parent,
  cookies
}: {
  params: { taskId: string };
  parent: () => Promise<{ user: { userId: number; role: string } }>;
  cookies: import('@sveltejs/kit').Cookies;
}) => {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    throw error(400, 'Invalid task ID');
  }

  const parentData = await parent();

  // Verify task exists by checking if we can access collaborators
  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);
  const result = await accessControlService.getTaskCollaborators(taskId);

  if (!result.success) {
    if (result.status === 404) {
      throw error(404, 'Task not found');
    }
    // For other errors (like 403 forbidden), we still allow access to the layout
    // The collaborators page will handle the error display
  }

  return {
    taskId,
    currentUserId: parentData.user.userId
  };
};
