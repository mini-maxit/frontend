import * as v from 'valibot';
import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';
import type { SubmissionDetailed } from '$lib/dto/submission';
import * as m from '$lib/paraglide/messages';
import { env } from '$env/dynamic/private';

export interface SubmissionWithFileContent extends SubmissionDetailed {
  fileContent: string;
}

export const getSubmissionDetails = query(
  v.number(),
  async (submissionId: number): Promise<SubmissionWithFileContent> => {
    const event = getRequestEvent();
    const apiClient = createApiClient(event.cookies);
    const submissionService = new SubmissionService(apiClient);

    // Fetch submission details
    const submissionResult = await submissionService.getSubmissionById(submissionId);
    if (!submissionResult.success || !submissionResult.data) {
      error(submissionResult.status, {
        message: submissionResult.error || 'Failed to fetch submission details.'
      });
    }

    const submission = submissionResult.data;

    // Fetch file content from the fileUrl
    let fileContent = '';
    try {
      // Validate the URL to prevent SSRF attacks
      const fileUrl = new URL(submission.fileUrl);

      // Only allow URLs from trusted domains: backend API or file storage
      const backendUrl = new URL(env.BACKEND_API_URL || 'http://localhost:8000');
      const fileStorageUrl = new URL(env.FILE_STORAGE_URL || 'http://file-storage:8888');

      const isBackendDomain = fileUrl.hostname === backendUrl.hostname;
      const isFileStorageDomain = fileUrl.hostname === fileStorageUrl.hostname;

      if (!isBackendDomain && !isFileStorageDomain) {
        fileContent = m.submission_details_file_load_error();
      } else {
        const fileResponse = await fetch(submission.fileUrl);
        if (!fileResponse.ok) {
          fileContent = m.submission_details_file_load_error();
        } else {
          fileContent = await fileResponse.text();
        }
      }
    } catch (err) {
      fileContent = m.submission_details_file_fetch_error();
    }

    return {
      ...submission,
      fileContent
    };
  }
);
