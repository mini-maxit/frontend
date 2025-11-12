export interface Task {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface TaskDetail {
  id: number;
  title: string;
  createdAt: string;
  createdBy: number;
  createdByName: string;
  descriptionUrl: string;
  pdfDataUrl?: string | null;
}

export interface TaskLimit {
  order: number;
  memoryLimit: number;
  timeLimit: number;
}

export interface UpdateTaskLimitsDto {
  limits: Array<{
    order: number;
    memoryLimit: number;
    timeLimit: number;
  }>;
}

export interface UploadTaskResponse {
  id: number;
}

export interface UploadTaskDto {
  title: string;
  archive: File;
}

export interface UserContestTask {
  id: number;
  title: string;
  createdAt: string;
  createdBy: number;
  createdByName: string;
  descriptionUrl: string;
  pdfDataUrl?: string | null;
  attemptCount: number;
  bestScore: number;
  maxScore: number;
}

export interface ContestTaskWithStatistics {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  attemptCount: number;
  bestScore: number | null;
}
