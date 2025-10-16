import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Language, SubmitSolutionDto } from '../dto/submission';

export class SubmissionService {
  constructor(private apiClient: ApiService) {}

  async submitSolution(body: SubmitSolutionDto): Promise<{
    success: boolean;
    status: number;
    data?: null;
    error?: string;
  }> {
    const formData = new FormData();
    formData.append('taskID', body.taskID.toString());
    formData.append('solution', body.solution);
    formData.append('languageID', body.languageID.toString());

    try {
      const response = await this.apiClient.post<ApiResponse<null>>({
        url: '/submission/submit',
        body: formData
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

  async getAvailableLanguages(): Promise<{
    success: boolean;
    status: number;
    data?: Language[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Language[]>>({
        url: '/submission/languages'
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
}
