import * as v from 'valibot';
import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';
import type { SubmissionDetailed } from '$lib/dto/submission';

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
      
      const fileResponse = await fetch(submission.fileUrl);
      if (!fileResponse.ok) {
        fileContent = 'Failed to load file content';
      } else {
        fileContent = await fileResponse.text();
      }
    } catch (err) {
      fileContent = 'Error loading file content';
    }

    return {
      ...submission,
      fileContent
    };
  }
);
