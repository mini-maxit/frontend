import { createApiClient } from './ApiService';
import type { ContestListResponse } from '$lib/dto/contest';
import type { Cookies } from '@sveltejs/kit';

export class ContestService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getContests() {
    const response = await this.apiClient.get<ContestListResponse>({
      url: '/contest/'
    });
    return response.data;
  }
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
