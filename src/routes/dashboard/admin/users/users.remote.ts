import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { error } from '@sveltejs/kit';
import type { UserEditDto } from '$lib/dto/user';
import * as v from 'valibot';
import { UserRole } from '$lib/dto/jwt';

/**
 * getUsers now accepts an OPTIONAL params object.
 * This allows calling getUsers() with no arguments (undefined),
 * avoiding schema validation errors when no paging/sorting is desired.
 */
export const getUsers = query(
  v.optional(
    v.object({
      limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(1000))),
      offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
      // Format: "field:asc" or "field:desc"
      sort: v.optional(v.pipe(v.string(), v.regex(/^[a-zA-Z_]+:(asc|desc)$/)))
    })
  ),
  async (params) => {
    const event = getRequestEvent();
    const apiClient = createApiClient(event.cookies);
    const userService = new UserService(apiClient);

    const result = await userService.listUsers({
      limit: params?.limit,
      offset: params?.offset,
      sort: params?.sort
    });

    if (!result.success || !result.data) {
      error(result.status, { message: result.error || 'Failed to fetch users.' });
    }

    // Return full paginated structure so consumers can access both items and pagination metadata
    return {
      items: result.data.items,
      pagination: result.data.pagination
    };
  }
);

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

  return { success: true };
});
