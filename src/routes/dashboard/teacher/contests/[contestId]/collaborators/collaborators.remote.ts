import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { UserService } from '$lib/services/UserService';
import { Permission, ResourceType } from '$lib/dto/accessControl';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getContestCollaborators = query(v.number(), async (contestId: number) => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);

  const result = await accessControlService.getContestCollaborators(contestId);

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
  // Client-side filtering is performed in the AddContestCollaboratorButton component.
  const result = await userService.listUsers({ limit: 1000 });

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load users' });
  }

  return result.data;
});

export const getAssignableUsers = query(v.number(), async (contestId: number) => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);

  const result = await accessControlService.getAssignableUsers(ResourceType.Contests, contestId, {
    limit: 1000
  });

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load assignable users' });
  }

  return result.data;
});

export const addCollaborator = form(
  v.object({
    contestId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    permission: v.picklist([Permission.Edit, Permission.Manage])
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.addContestCollaborator(data.contestId, {
      user_id: data.userId,
      permission: data.permission
    });

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to add collaborator' });
    }

    // Refresh collaborators list
    await getContestCollaborators(data.contestId).refresh();

    return { success: true };
  }
);

export type AddCollaboratorForm = typeof addCollaborator;

export const updateCollaborator = form(
  v.object({
    contestId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    permission: v.picklist([Permission.Edit, Permission.Manage])
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.updateContestCollaborator(
      data.contestId,
      data.userId,
      {
        permission: data.permission
      }
    );

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to update collaborator' });
    }

    // Refresh collaborators list
    await getContestCollaborators(data.contestId).refresh();

    return { success: true };
  }
);

export type UpdateCollaboratorForm = typeof updateCollaborator;

export const removeCollaborator = form(
  v.object({
    contestId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.deleteContestCollaborator(
      data.contestId,
      data.userId
    );

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to remove collaborator' });
    }

    // Refresh collaborators list
    await getContestCollaborators(data.contestId).refresh();

    return { success: true };
  }
);

export type RemoveCollaboratorForm = typeof removeCollaborator;
