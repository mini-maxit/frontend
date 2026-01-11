import { query, form, getRequestEvent } from '$app/server';
import { createGroupsManagementService } from '$lib/services/GroupsManagementService';
import { ApiError } from '$lib/services/ApiService';
import type { Group } from '$lib/dto/group';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

export const getAllGroups = query(async (): Promise<Group[]> => {
  const { cookies } = getRequestEvent();

  try {
    const groupsManagementService = createGroupsManagementService(cookies);
    const groups = await groupsManagementService.getAllGroups();

    return groups;
  } catch (err) {
    console.error('Failed to load all groups:', err);

    if (err instanceof ApiError) {
      throw error(err.getStatus(), err.getApiMessage());
    }

    throw error(500, 'Failed to load groups');
  }
});

export const createGroup = form(
  v.object({
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
      const groupsManagementService = createGroupsManagementService(cookies);
      const group = await groupsManagementService.createGroup(data);

      // Refresh the groups list
      await getAllGroups().refresh();

      return { success: true, group };
    } catch (err) {
      console.error('Failed to create group:', err);

      if (err instanceof ApiError) {
        throw error(err.getStatus(), err.getApiMessage());
      }

      throw error(500, 'Failed to create group');
    }
  }
);

export type CreateGroupForm = typeof createGroup;
