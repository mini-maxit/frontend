import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { GroupsManagementService } from '$lib/services/GroupsManagementService';
import { error } from '@sveltejs/kit';

export const getGroups = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const groupsManagementService = new GroupsManagementService(apiClient);

  const result = await groupsManagementService.getGroups();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch groups.' });
  }

  return result.data;
});
