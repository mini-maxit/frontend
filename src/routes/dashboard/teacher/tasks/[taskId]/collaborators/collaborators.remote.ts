import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getTaskCollaborators = query(v.number(), async (taskId: number) => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);

  const result = await accessControlService.getTaskCollaborators(taskId);

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load collaborators' });
  }

  return result.data;
});
