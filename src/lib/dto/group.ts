export interface Group {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: number;
  name: string;
  surname: string;
  username: string;
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
