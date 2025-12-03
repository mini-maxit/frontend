import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { GroupService } from '$lib/services/GroupService';
import { error } from '@sveltejs/kit';

export const getGroups = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const groupService = new GroupService(apiClient);

  const result = await groupService.listGroups();

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch groups.' });
  }

  return {
    items: result.data
  };
});
