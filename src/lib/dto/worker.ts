export enum WorkerStatusType {
  Idle = 'idle',
  Busy = 'busy'
}

export interface WorkerStatusItem {
  id: number;
  status: WorkerStatusType;
  processingMessageId?: string;
}

export interface WorkerStatus {
  busyWorkers: number;
  statusTime: string;
  totalWorkers: number;
  workerStatus: WorkerStatusItem[];
}
