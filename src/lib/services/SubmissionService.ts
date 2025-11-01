import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Language, SubmitSolutionDto, Submission } from '../dto/submission';

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
    if (body.contestID !== undefined) {
      formData.append('contestID', body.contestID.toString());
    }

    try {
      const response = await this.apiClient.post<ApiResponse<null>>({
        url: '/submissions/submit',
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
        url: '/submissions/languages'
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

  async getAllSubmissions(params?: { limit?: number; offset?: number }): Promise<{
    success: boolean;
    status: number;
    data?: Submission[];
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/submissions/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await this.apiClient.get<ApiResponse<Submission[]>>({
        url
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
