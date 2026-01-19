import * as v from 'valibot';

/**
 * Schema for submitting a solution to a task
 */
export const SubmitSolutionSchema = v.object({
	taskId: v.pipe(v.number(), v.minValue(1)),
	solution: v.instance(File, 'Solution file is required'),
	languageId: v.pipe(v.number(), v.minValue(1))
});

export type SubmitSolutionInput = v.InferOutput<typeof SubmitSolutionSchema>;

/**
 * Schema for submitting a solution to a contest task
 */
export const SubmitContestSolutionSchema = v.object({
	contestId: v.pipe(v.number(), v.minValue(1)),
	taskId: v.pipe(v.number(), v.minValue(1)),
	solution: v.instance(File, 'Solution file is required'),
	languageId: v.pipe(v.number(), v.minValue(1))
});

export type SubmitContestSolutionInput = v.InferOutput<typeof SubmitContestSolutionSchema>;
