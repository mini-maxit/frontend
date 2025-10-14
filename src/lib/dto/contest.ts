export interface Contest {
  id: number;
  name: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  isVisible: boolean;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
}

export interface ContestListResponse {
  data: Contest[];
  ok: boolean;
}

export type ContestStatus = 'live' | 'upcoming' | 'past';

export interface ContestWithStatus extends Contest {
  status: ContestStatus;
  startDate: string;
  endDate: string;
  participantCount?: number;
  tasksCount?: number;
  isRegistered?: boolean;
  endsInMinutes?: number;
}
