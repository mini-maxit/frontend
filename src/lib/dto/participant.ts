import type { User } from './user';

export interface ParticipantAccess extends User {
  direct: boolean;
  groups: { id: number; name: string }[];
}
