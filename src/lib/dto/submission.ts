import type { UserRole } from './jwt';

export enum SubmissionStatus {
  Received = 'received',
  SentForEvaluation = 'sent for evaluation',
  Evaluated = 'evaluated',
  Lost = 'lost'
}

export enum SubmissionResultCode {
  Success = 'success',
  TestFailed = 'test_failed',
  CompilationError = 'compilation_error',
  InitializationError = 'initialization_error',
  InternalError = 'internal_error'
}

export enum TestResultCode {
  OutputDifference = 'output_difference',
  TimeLimitExceeded = 'time_limit_exceeded',
  MemoryLimitExceeded = 'memory_limit_exceeded',
  RuntimeError = 'runtime_error',
  NotExecuted = 'not_executed'
}

export interface Language {
  id: number;
  language: string;
  version: string;
  fileExtension: string;
}

export interface SubmitSolutionDto {
  taskID: number;
  solution: File;
  languageID: number;
  contestID?: number;
}

export interface TestResult {
  id: number;
  testCaseId: number;
  passed: boolean;
  submissionResultId: number;
  code: TestResultCode;
  errorMessage: string;
  executionTimeMs: number;
}

export interface SubmissionResult {
  code: SubmissionResultCode;
  createdAt: string;
  id: number;
  message: string;
  submissionId: number;
  testResults: TestResult[];
}

export interface SubmissionTask {
  createdAt: string;
  createdBy: number;
  id: number;
  title: string;
  updatedAt: string;
}

export interface SubmissionUser {
  email: string;
  id: number;
  name: string;
  role: UserRole;
  surname: string;
  username: string;
}

export interface Submission {
  checkedAt: string;
  contestId?: number;
  id: number;
  language: Language;
  languageId: number;
  order: number;
  result: SubmissionResult;
  status: SubmissionStatus;
  submittedAt: string;
  task: SubmissionTask;
  taskId: number;
  user: SubmissionUser;
  userId: number;
}

export interface GetContestSubmissionsParams {
  limit?: number;
  offset?: number;
  sort?: string;
}
