import type { ApiResponse } from './response';

export interface ApiErrorData {
  code: string;
  message: string;
}

export type ApiErrorResponse = ApiResponse<ApiErrorData>;

export function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Partial<ApiErrorResponse>;

  return (
    typeof candidate.ok === 'boolean' &&
    typeof candidate.data === 'object' &&
    candidate.data !== null &&
    typeof candidate.data.code === 'string' &&
    typeof candidate.data.message === 'string'
  );
}
