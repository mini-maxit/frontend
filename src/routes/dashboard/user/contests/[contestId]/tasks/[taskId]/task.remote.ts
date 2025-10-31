import * as v from 'valibot';
import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { createContestService } from '$lib/services/ContestService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';

const GetContestTaskSchema = v.object({
  contestId: v.pipe(v.number(), v.minValue(1)),
  taskId: v.pipe(v.number(), v.minValue(1))
});

type GetContestTaskInput = v.InferOutput<typeof GetContestTaskSchema>;

export const getContestTask = query(GetContestTaskSchema, async (input: GetContestTaskInput) => {
  const event = getRequestEvent();
  const contestService = createContestService(event.cookies);

  const task = await contestService.getContestTask(input.contestId, input.taskId);

  // Fetch PDF description if available
  let pdfDataUrl: string | null = null;
  if (task.descriptionUrl) {
    try {
      const response = await fetch(task.descriptionUrl);

      if (response.ok) {
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        pdfDataUrl = `data:application/pdf;base64,${base64}`;
      }
    } catch (err) {
      // If PDF fetch fails, continue without it
      console.error('Failed to fetch PDF:', err);
    }
  }

  return {
    ...task,
    pdfDataUrl
  };
});

export const getLanguages = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const submissionService = new SubmissionService(apiClient);

  const result = await submissionService.getAvailableLanguages();
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to fetch languages.' });
  }

  return result.data || [];
});
