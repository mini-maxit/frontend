import type { UserInfo } from './contest';
export interface Group {
  id: number;
  name: string;
  createdBy: number;
  creator?: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: number;
  name: string;
  surname: string;
}

export interface GroupWithMembers extends Group {
  members: GroupMember[];
}

export interface CreateGroupDto {
  name: string;
}

export interface EditGroupDto {
  name?: string;
}

export interface GroupUserIdsDto {
  userIDs: number[];
}
