export enum ContestRegistrationStatus {
  Registered = 'registered',
  AwaitingApproval = 'awaitingApproval',
  RegistrationClosed = 'registrationClosed',
  CanRegister = 'canRegister'
}
export interface Contest {
  id: number;
  name: string;
  description: string;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  participantCount: number;
  taskCount: number;
  registrationStatus: ContestRegistrationStatus;
}

export type ContestStatus = 'live' | 'upcoming' | 'past';

export interface ContestWithStatus extends Contest {
  status: ContestStatus;
  startDate: string;
  endDate: string;
  endsInMinutes?: number;
}
