export interface WorkerStatusItem {
  id: number;
  status: string;
  processingMessageId?: string;
}

export interface WorkerStatus {
  busyWorkers: number;
  statusTime: string;
  totalWorkers: number;
  workerStatus: WorkerStatusItem[];
}
