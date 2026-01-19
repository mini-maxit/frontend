import * as v from 'valibot';
import { Permission } from '$lib/dto/accessControl';

/**
 * Schema for adding a collaborator to task/contest/group
 */
export const AddCollaboratorSchema = v.object({
	resourceId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid resource ID')),
	userId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID')),
	permission: v.enum(Permission, 'Invalid permission level')
});

/**
 * Schema for updating collaborator permissions
 */
export const UpdateCollaboratorSchema = v.object({
	resourceId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid resource ID')),
	userId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID')),
	permission: v.enum(Permission, 'Invalid permission level')
});

/**
 * Schema for removing a collaborator
 */
export const RemoveCollaboratorSchema = v.object({
	resourceId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid resource ID')),
	userId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid user ID'))
});

export type AddCollaboratorInput = v.InferOutput<typeof AddCollaboratorSchema>;
export type UpdateCollaboratorInput = v.InferOutput<typeof UpdateCollaboratorSchema>;
export type RemoveCollaboratorInput = v.InferOutput<typeof RemoveCollaboratorSchema>;
