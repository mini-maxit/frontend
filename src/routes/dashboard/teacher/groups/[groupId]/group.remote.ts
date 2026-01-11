import { query, form, command, getRequestEvent } from '$app/server';
import { createGroupsManagementService } from '$lib/services/GroupsManagementService';
import { ApiError, createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import type { Group } from '$lib/dto/group';
import type { User } from '$lib/dto/user';
import type { PaginatedData } from '$lib/dto/response';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

export const getGroup = query(v.number(), async (groupId: number): Promise<Group> => {
  const { cookies } = getRequestEvent();

  try {
    const groupsService = createGroupsManagementService(cookies);
    return await groupsService.getGroupById(groupId);
  } catch (err) {
    console.error('Failed to load group:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load group');
  }
});

export const getGroupMembers = query(v.number(), async (groupId: number): Promise<User[]> => {
  const { cookies } = getRequestEvent();

  try {
    const groupsService = createGroupsManagementService(cookies);
    return await groupsService.getGroupMembers(groupId);
  } catch (err) {
    console.error('Failed to load group members:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load group members');
  }
});

export const getAllUsers = query(async (): Promise<PaginatedData<User>> => {
  const { cookies } = getRequestEvent();

  try {
    const apiClient = createApiClient(cookies);
    const userService = new UserService(apiClient);
    const result = await userService.listUsers({ limit: 1000 });

    if (!result.success) {
      throw error(result.status, result.error || 'Failed to load users');
    }

    return result.data!;
  } catch (err) {
    console.error('Failed to load users:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load users');
  }
});

export const updateGroup = form(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    name: v.pipe(
      v.string(),
      v.nonEmpty(m.groups_form_name_required()),
      v.minLength(3, m.groups_form_name_min_length()),
      v.maxLength(50, m.groups_form_name_max_length())
    )
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const groupsService = createGroupsManagementService(cookies);
      const { id, ...groupData } = data;
      const group = await groupsService.updateGroup(id, groupData);

      // Refresh group
      await getGroup(id).refresh();

      return { success: true, group };
    } catch (err) {
      console.error('Failed to update group:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to update group');
    }
  }
);

export type UpdateGroupForm = typeof updateGroup;

export const addUsersToGroup = command(
  v.object({
    groupId: v.pipe(v.number(), v.integer()),
    userIDs: v.array(v.pipe(v.number(), v.integer()))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const groupsService = createGroupsManagementService(cookies);
      await groupsService.addUsersToGroup(data.groupId, data.userIDs);

      // Refresh members
      await getGroupMembers(data.groupId).refresh();

      return { success: true };
    } catch (err) {
      console.error('Failed to add users to group:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to add users to group');
    }
  }
);

export const removeUsersFromGroup = command(
  v.object({
    groupId: v.pipe(v.number(), v.integer()),
    userIDs: v.array(v.pipe(v.number(), v.integer()))
  }),
  async (data) => {
    const { cookies } = getRequestEvent();

    try {
      const groupsService = createGroupsManagementService(cookies);
      await groupsService.removeUsersFromGroup(data.groupId, data.userIDs);

      // Refresh members
      await getGroupMembers(data.groupId).refresh();

      return { success: true };
    } catch (err) {
      console.error('Failed to remove users from group:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to remove users from group');
    }
  }
);
