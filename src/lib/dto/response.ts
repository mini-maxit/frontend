export interface ApiResponse<T = unknown> {
  data: T;
  ok: boolean;
}
