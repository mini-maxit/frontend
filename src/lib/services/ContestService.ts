import { createApiClient } from './ApiService';
import type { Contest } from '$lib/dto/contest';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/dto/response';

export class ContestService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getContests() {
    const response = await this.apiClient.get<ApiResponse<Contest>>({
      url: '/contest/'
    });
    return response.data;
  }
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
