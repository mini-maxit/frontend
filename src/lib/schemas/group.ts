import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

/**
 * Schema for creating a new group
 */
export const CreateGroupSchema = v.object({
	name: v.pipe(
		v.string(),
		v.nonEmpty(m.groups_form_name_required()),
		v.minLength(3, m.groups_form_name_min_length()),
		v.maxLength(50, m.groups_form_name_max_length())
	)
});

export type CreateGroupInput = v.InferOutput<typeof CreateGroupSchema>;

/**
 * Schema for editing a group
 */
export const UpdateGroupSchema = v.object({
	groupId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid group ID')),
	name: v.pipe(
		v.string(),
		v.nonEmpty(m.groups_form_name_required()),
		v.minLength(3, m.groups_form_name_min_length()),
		v.maxLength(50, m.groups_form_name_max_length())
	)
});

/**
 * Schema for adding users to a group
 */
export const AddUsersToGroupSchema = v.object({
	groupId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid group ID')),
	userIds: v.pipe(
		v.array(v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID'))),
		v.minLength(1, 'At least one user must be selected')
	)
});

/**
 * Schema for removing users from a group
 */
export const RemoveUsersFromGroupSchema = v.object({
	groupId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid group ID')),
	userIds: v.pipe(
		v.array(v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID'))),
		v.minLength(1, 'At least one user must be selected')
	)
});

export type UpdateGroupInput = v.InferOutput<typeof UpdateGroupSchema>;
export type AddUsersToGroupInput = v.InferOutput<typeof AddUsersToGroupSchema>;
export type RemoveUsersFromGroupInput = v.InferOutput<typeof RemoveUsersFromGroupSchema>;
