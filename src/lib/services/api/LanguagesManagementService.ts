import type { ApiService } from './ApiService';
import { ApiError } from './ApiService';
import type { ApiResponse } from '$lib/dto/response';
import type { Language } from '$lib/dto/submission';

/**
 * Client-side service for language management API calls (admin only)
 */
export class LanguagesManagementService {
  constructor(private apiClient: ApiService) {}

  async getAllLanguages(): Promise<{
    success: boolean;
    status: number;
    data?: Language[];
    error?: string;
  }> {
    try {
      const response: ApiResponse<Language[]> = await this.apiClient.get({
        url: '/languages-management/languages'
      });
      return { success: true, data: response.data, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }

  async toggleLanguageVisibility(languageId: number): Promise<{
    success: boolean;
    status: number;
    error?: string;
  }> {
    try {
      await this.apiClient.patch({
        url: `/languages-management/languages/${languageId}`
      });
      return { success: true, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }
}
