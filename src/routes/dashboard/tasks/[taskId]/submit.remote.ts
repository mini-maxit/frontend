import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';
import { getTask } from './task.remote';

const SubmitSolutionSchema = v.object({
  taskId: v.pipe(v.number(), v.minValue(1)),
  solution: v.instance(File, 'Solution file is required'),
  languageId: v.pipe(v.number(), v.minValue(1))
});

type SubmitSolutionData = v.InferOutput<typeof SubmitSolutionSchema>;

export const submitSolution = form(SubmitSolutionSchema, async (data: SubmitSolutionData) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const submissionService = new SubmissionService(apiClient);

  const result = await submissionService.submitSolution({
    taskID: data.taskId,
    solution: data.solution,
    languageID: data.languageId
  });

  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to submit solution.' });
  }

  await getTask(data.taskId).refresh();

  return { success: true };
});

export type SubmitSolutionRemoteForm = typeof submitSolution;
