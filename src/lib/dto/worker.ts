export interface WorkerStatus {
  busyWorkers: number;
  statusTime: string;
  totalWorkers: number;
  workerStatus: Record<string, string>;
}
