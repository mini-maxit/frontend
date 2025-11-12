export interface ApiResponse<T = unknown> {
  data: T;
  ok: boolean;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedData<T = unknown> {
  pagination: PaginationMetadata;
  items: T[];
}
