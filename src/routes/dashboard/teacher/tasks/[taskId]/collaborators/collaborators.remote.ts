import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { UserService } from '$lib/services/UserService';
import { Permission } from '$lib/dto/accessControl';
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

export const getAllUsers = query(async () => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const userService = new UserService(apiClient);

  // Fetch users with a high limit for client-side filtering.
  // Client-side filtering is performed in the AddCollaboratorButton component.
  const result = await userService.listUsers({ limit: 1000 });

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load users' });
  }

  return result.data.data;
});

export const addCollaborator = form(
  v.object({
    taskId: v.pipe(v.number(), v.integer(), v.minValue(1)),
    userId: v.pipe(v.number(), v.integer(), v.minValue(1)),
    permission: v.picklist([Permission.Edit, Permission.Manage])
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.addTaskCollaborator(data.taskId, {
      user_id: data.userId,
      permission: data.permission
    });

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to add collaborator' });
    }

    // Refresh collaborators list
    await getTaskCollaborators(data.taskId).refresh();

    return { success: true };
  }
);

export type AddCollaboratorForm = typeof addCollaborator;
