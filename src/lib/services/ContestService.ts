import { ApiError, createApiClient } from './ApiService';
import type { Contest, UserContestsResponse } from '$lib/dto/contest';
import type { Cookies } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/dto/response';

export class ContestService {
  private apiClient;

  constructor(cookies: Cookies) {
    this.apiClient = createApiClient(cookies);
  }

  async getOngoing(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contest/ongoing'
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get ongoing contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getUpcoming(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contest/upcoming'
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get upcoming contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getPast(): Promise<Contest[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Contest[]>>({
        url: '/contest/past'
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get past contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getUserContests(userId: number): Promise<UserContestsResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserContestsResponse>>({
        url: `/user/${userId}/contests`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get user contests:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async registerForContest(contestId: number): Promise<void> {
    try {
      await this.apiClient.post<ApiResponse<void>>({
        url: `/contest/${contestId}/register`
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to register for contest:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }
}

export function createContestService(cookies: Cookies): ContestService {
  return new ContestService(cookies);
}
