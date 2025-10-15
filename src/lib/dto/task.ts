export interface Task {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

export interface UploadTaskResponse {
  id: number;
}
