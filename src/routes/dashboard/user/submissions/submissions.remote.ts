import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';
import type { Submission } from '$lib/dto/submission';

export const getSubmissions = query(async (): Promise<Submission[]> => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const submissionService = new SubmissionService(apiClient, event.locals.user!.role);

  const result = await submissionService.getAllSubmissions();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch submissions.' });
  }

  return result.data;
});
