import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { error } from '@sveltejs/kit';
import type { User } from '$lib/dto/user';

export const getUserProfile = query(async (): Promise<User> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  const result = await userService.getCurrentUser();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch user profile.' });
  }

  return result.data;
});
