import type { ApiService } from './ApiService';
import type { ApiResponse } from '#lib/dto/response.js';
import type { AdminDashboardStats, ContestActivity } from '#lib/dto/dashboard.js';

/**
 * Client-side service for dashboard summaries (throws ApiError on failure)
 */
export class DashboardService {
  constructor(private apiClient: ApiService) {}

  async getAdminStats(): Promise<AdminDashboardStats> {
    const response = await this.apiClient.get<ApiResponse<AdminDashboardStats>>({
      url: '/dashboard/admin'
    });
    return response.data;
  }

  /** Submissions in the last 24h for managed contests that are running or ended in the last 7 days. */
  async getContestActivity(): Promise<ContestActivity[]> {
    const response = await this.apiClient.get<ApiResponse<ContestActivity[]>>({
      url: '/dashboard/teacher/contest-activity'
    });
    return response.data;
  }
}
