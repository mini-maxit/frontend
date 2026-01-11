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
  Contests = 'contests',
  Groups = 'groups'
}

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
 * Request body for adding a collaborator.
 */
export interface AddCollaboratorRequest {
  user_id: number;
  permission: Permission.Edit | Permission.Manage;
}

/**
 * Request body for updating a collaborator.
 */
export interface UpdateCollaboratorRequest {
  permission: Permission.Edit | Permission.Manage;
}
