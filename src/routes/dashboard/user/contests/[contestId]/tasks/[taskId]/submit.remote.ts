import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';
import { getContestTask } from './task.remote';

const SubmitContestSolutionSchema = v.object({
  contestId: v.pipe(v.number(), v.minValue(1)),
  taskId: v.pipe(v.number(), v.minValue(1)),
  solution: v.instance(File, 'Solution file is required'),
  languageId: v.pipe(v.number(), v.minValue(1))
});

type SubmitContestSolutionData = v.InferOutput<typeof SubmitContestSolutionSchema>;

export const submitContestSolution = form(
  SubmitContestSolutionSchema,
  async (data: SubmitContestSolutionData) => {
    const event = getRequestEvent();
    const apiClient = createApiClient(event.cookies);
    const submissionService = new SubmissionService(apiClient);

    const result = await submissionService.submitSolution({
      taskID: data.taskId,
      contestID: data.contestId,
      solution: data.solution,
      languageID: data.languageId
    });

    if (!result.success) {
      error(result.status, { message: result.error || 'Failed to submit solution.' });
    }

    getContestTask({ contestId: data.contestId, taskId: data.taskId }).refresh();

    return { success: true };
  }
);

export type SubmitContestSolutionRemoteForm = typeof submitContestSolution;
