import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import type { User } from '$lib/dto/user';

export const getUserProfile = query(async (): Promise<User> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  return await userService.getCurrentUser();
});
