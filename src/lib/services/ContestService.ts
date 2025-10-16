import { createApiClient } from './ApiService';
import type { Contest, UserContestsResponse } from '$lib/dto/contest';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/dto/response';

export class ContestService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getOngoing() {
    const response = await this.apiClient.get<ApiResponse<Contest[]>>({
      url: '/contest/ongoing'
    });
    return response.data;
  }

  async getUpcoming() {
    const response = await this.apiClient.get<ApiResponse<Contest[]>>({
      url: '/contest/upcoming'
    });
    return response.data;
  }

  async getPast() {
    const response = await this.apiClient.get<ApiResponse<Contest[]>>({
      url: '/contest/past'
    });
    return response.data;
  }

  async getUserContests(userId: number) {
    const response = await this.apiClient.get<ApiResponse<UserContestsResponse>>({
      url: `/user/${userId}/contests`
    });
    return response.data;
  }
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
