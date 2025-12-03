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
  user_id: number;
  user_name: string;
  user_email: string;
  permission: Permission;
  added_at: string;
}
