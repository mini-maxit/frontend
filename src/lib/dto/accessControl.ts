import * as v from 'valibot';

/**
 * Permission levels for collaborators on tasks and contests.
 */
export enum Permission {
  Edit = 'edit',
  Manage = 'manage',
  Owner = 'owner'
}

/**
 * Resource types for access control.
 */
export enum ResourceType {
  Tasks = 'tasks',
  Contests = 'contests'
}

/**
 * Valibot schema for Permission enum.
 */
export const PermissionSchema = v.picklist([Permission.Edit, Permission.Manage, Permission.Owner]);

/**
 * Valibot schema for editable permissions (for add/update operations).
 */
export const EditablePermissionSchema = v.picklist([Permission.Edit, Permission.Manage]);

/**
 * Valibot schema for ResourceType enum.
 */
export const ResourceTypeSchema = v.picklist([ResourceType.Tasks, ResourceType.Contests]);

/**
 * Represents a collaborator on a task or contest.
 */
export interface Collaborator {
  userId: number;
  userName: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  permission: Permission;
  addedAt: string;
}

/**
 * Valibot schema for Collaborator.
 */
export const CollaboratorSchema = v.object({
  userId: v.number(),
  userName: v.string(),
  userEmail: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  permission: PermissionSchema,
  addedAt: v.string()
});

/**
 * Request body for adding a collaborator.
 */
export interface AddCollaboratorRequest {
  user_id: number;
  permission: Permission.Edit | Permission.Manage;
}

/**
 * Valibot schema for AddCollaboratorRequest.
 */
export const AddCollaboratorRequestSchema = v.object({
  user_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  permission: EditablePermissionSchema
});

/**
 * Request body for updating a collaborator.
 */
export interface UpdateCollaboratorRequest {
  permission: Permission.Edit | Permission.Manage;
}

/**
 * Valibot schema for UpdateCollaboratorRequest.
 */
export const UpdateCollaboratorRequestSchema = v.object({
  permission: EditablePermissionSchema
});
