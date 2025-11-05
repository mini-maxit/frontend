import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';
import type { Language, SubmitSolutionDto, Submission } from '../dto/submission';
import { UserRole } from '../dto/jwt';

export class SubmissionService {
  private userRole: UserRole;

  constructor(
    private apiClient: ApiService,
    userRole: UserRole
  ) {
    this.userRole = userRole;
  }

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
      /**
       * Note: The submit endpoint is not documented in the swagger file.
       * Keeping the original path until clarified with backend team.
       * This might need to be updated to a role-based endpoint later.
       */
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
      /**
       * Note: The languages endpoint is not documented in the swagger file.
       * Keeping the original path until clarified with backend team.
       * This might need to be updated to a role-based endpoint later.
       */
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

      const url = `/student/submissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
