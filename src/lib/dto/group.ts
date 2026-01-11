export interface Group {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
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
