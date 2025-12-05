/**
 * Permission levels for collaborators on tasks and contests.
 */
export enum Permission {
  Edit = 'edit',
  Manage = 'manage',
  Owner = 'owner'
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
