import { query, form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { AccessControlService } from '$lib/services/AccessControlService';
import { Permission, ResourceType } from '$lib/dto/accessControl';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getGroupCollaborators = query(v.number(), async (groupId: number) => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);

  const result = await accessControlService.getCollaborators(ResourceType.Groups, groupId);

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load collaborators' });
  }

  return result.data;
});

export const getAssignableUsers = query(v.number(), async (groupId: number) => {
  const { cookies } = getRequestEvent();

  const apiClient = createApiClient(cookies);
  const accessControlService = new AccessControlService(apiClient);

  const result = await accessControlService.getAssignableUsers(ResourceType.Groups, groupId, {
    limit: 1000
  });

  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to load assignable users' });
  }

  return result.data;
});

export const addCollaborator = form(
  v.object({
    groupId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    permission: v.picklist([Permission.Edit, Permission.Manage])
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.addCollaborator(ResourceType.Groups, data.groupId, {
      user_id: data.userId,
      permission: data.permission
    });

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to add collaborator' });
    }

    // Refresh collaborators list
    await getGroupCollaborators(data.groupId).refresh();

    return { success: true };
  }
);

export type AddCollaboratorForm = typeof addCollaborator;

export const updateCollaborator = form(
  v.object({
    groupId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    permission: v.picklist([Permission.Edit, Permission.Manage])
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.updateCollaborator(
      ResourceType.Groups,
      data.groupId,
      data.userId,
      {
        permission: data.permission
      }
    );

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to update collaborator' });
    }

    // Refresh collaborators list
    await getGroupCollaborators(data.groupId).refresh();

    return { success: true };
  }
);

export type UpdateCollaboratorForm = typeof updateCollaborator;

export const removeCollaborator = form(
  v.object({
    groupId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
    userId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    const apiClient = createApiClient(cookies);
    const accessControlService = new AccessControlService(apiClient);

    const result = await accessControlService.deleteCollaborator(
      ResourceType.Groups,
      data.groupId,
      data.userId
    );

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to remove collaborator' });
    }

    // Refresh collaborators list
    await getGroupCollaborators(data.groupId).refresh();

    return { success: true };
  }
);

export type RemoveCollaboratorForm = typeof removeCollaborator;
