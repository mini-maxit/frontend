import { Permission } from './accessControl';

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

// Contest data for creators/teachers (without registrationStatus)
export interface CreatedContest {
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
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isVisible: boolean;
}

export interface ManagedContest extends CreatedContest {
  permissionType: Permission;
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

export interface ContestWithStats {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: number;
  creatorName: string;
  participantCount: number;
  taskCount: number;
  solvedTaskCount: number;
  status: ContestStatus;
  isSubmissionOpen: boolean;
}

export interface PastContestWithStats {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: number;
  creatorName: string;
  participantCount: number;
  taskCount: number;
  status: ContestStatus;
  isSubmissionOpen: boolean;
  score: number;
  maximumScore: number;
  rank: number;
  solvedPercentage: number;
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

export interface EditContestDto {
  name: string;
  description: string;
  startAt: string;
  endAt: string | null;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isVisible: boolean;
}

export enum RegistrationRequestStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export interface RegistrationRequest {
  id: number;
  contestId: number;
  userId: number;
  status: RegistrationRequestStatus;
  createdAt: string;
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
    username: string;
    role: string;
    createdAt: string;
  };
}

export interface AddContestTaskDto {
  taskId: number;
  startAt: string;
  endAt: string | null;
}

export interface ContestTask {
  id: number;
  contestId: number;
  taskId: number;
  startAt: string;
  endAt: string;
  createdAt: string;
}

export interface BaseContest {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: number;
}

export interface TaskInfo {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface TaskResult {
  task: TaskInfo;
  bestScore: number;
  submissionCount: number;
  bestSubmissionId: number;
}

export interface ContestResults {
  contest: BaseContest;
  taskResults: TaskResult[];
}

export interface UserTaskPerformance {
  taskId: number;
  taskTitle: string;
  bestScore: number;
  attemptCount: number;
  isSolved: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  surname: string;
}

export interface UserContestStats {
  user: UserInfo;
  tasksSolved: number;
  tasksPartiallySolved: number;
  tasksAttempted: number;
  taskBreakdown: UserTaskPerformance[];
}

export interface TaskUserStats {
  user: UserInfo;
  bestScore: number;
  submissionCount: number;
  bestSubmissionId: number;
}

export interface ContestDetailed {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: number;
  creatorName: string;
  participantCount: number;
  taskCount: number;
  status: ContestStatus;
  isSubmissionOpen: boolean;
}
