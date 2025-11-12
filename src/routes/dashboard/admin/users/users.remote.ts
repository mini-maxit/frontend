import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { error } from '@sveltejs/kit';
import type { UserEditDto } from '$lib/dto/user';
import * as v from 'valibot';
import { UserRole } from '$lib/dto/jwt';

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

const UpdateUserSchema = v.object({
  userId: v.pipe(v.number(), v.integer()),
  email: v.pipe(v.string(), v.email()),
  name: v.pipe(v.string(), v.nonEmpty()),
  surname: v.pipe(v.string(), v.nonEmpty()),
  username: v.pipe(v.string(), v.nonEmpty()),
  role: v.picklist([UserRole.Student, UserRole.Teacher, UserRole.Admin])
});

export const updateUser = form(UpdateUserSchema, async (data) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const userService = new UserService(apiClient);

  const userData: UserEditDto = {
    email: data.email,
    name: data.name,
    surname: data.surname,
    username: data.username,
    role: data.role
  };

  const result = await userService.editUser(data.userId, userData);
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to update user.' });
  }

  // Refresh the users list
  await getUsers().refresh();

  return { success: true };
});
