import { Permission } from './accessControl';

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
}

// Contest data for creators/teachers
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
  isSubmissionOpen: boolean;
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
  isSubmissionOpen: boolean;
}

export interface EditContestDto {
  name: string;
  description: string;
  startAt: string;
  endAt: string | null;
  isSubmissionOpen: boolean;
}

export interface AddContestTaskDto {
  taskId: number;
  startAt: string;
  endAt: string | null;
  /** Contest override of the task's limits; null/undefined = task default. */
  timeLimitMs?: number | null;
  memoryLimitKb?: number | null;
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

export interface ContestLeaderboardEntry {
  user: UserInfo;
  tasksSolved: number;
  tasksPartiallySolved: number;
  tasksAttempted: number;
  taskBreakdown: TaskResult[];
}

export interface ContestMyResults {
  taskResults: TaskResult[];
}

export interface ContestResults {
  contest: BaseContest;
  taskResults: TaskResult[];
  leaderboard?: ContestLeaderboardEntry[];
  myResults?: ContestMyResults;
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
