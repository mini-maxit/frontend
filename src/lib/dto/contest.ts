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
  status: ContestStatus;
  registrationStatus: ContestRegistrationStatus;
}

export enum ContestStatus {
  Ongoing = 'ongoing',
  Upcoming = 'upcoming',
  Past = 'past'
}

export interface UserContest {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  participantCount: number;
  taskCount: number;
  solvedTaskCount: number;
  status: ContestStatus;
}

export interface UserContestsResponse {
  ongoing: UserContest[];
  upcoming: UserContest[];
  past: UserContest[];
}

export interface CreateContestDto {
  name: string;
  description: string;
  startAt: string;
  endAt: string | null;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isVisible: boolean;
}
