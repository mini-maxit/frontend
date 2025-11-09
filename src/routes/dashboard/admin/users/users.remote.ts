import { query, mutation, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { error } from '@sveltejs/kit';
import type { UserEditDto } from '$lib/dto/user';

export const getUsers = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  const result = await userService.listUsers();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch users.' });
  }

  return result.data;
});

export const getUserById = query(async (userId: number) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  const result = await userService.getUserById(userId);
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch user.' });
  }

  return result.data;
});

export const updateUser = mutation(async (userId: number, userData: UserEditDto) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  const result = await userService.editUser(userId, userData);
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to update user.' });
  }

  return { success: true };
});
