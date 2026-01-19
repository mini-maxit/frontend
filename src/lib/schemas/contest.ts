import * as v from 'valibot';

/**
 * Schema for creating a new contest
 */
export const CreateContestSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty('Contest name is required')),
	description: v.pipe(v.string(), v.nonEmpty('Description is required')),
	startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
	endAt: v.optional(v.string()),
	isRegistrationOpen: v.boolean(),
	isSubmissionOpen: v.boolean(),
	isVisible: v.boolean()
});

/**
 * Schema for updating an existing contest
 */
export const UpdateContestSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	name: v.pipe(v.string(), v.nonEmpty('Contest name is required')),
	description: v.pipe(v.string(), v.nonEmpty('Description is required')),
	startAt: v.pipe(v.string(), v.nonEmpty('Start date is required')),
	endAt: v.optional(v.string()),
	isRegistrationOpen: v.boolean(),
	isSubmissionOpen: v.boolean(),
	isVisible: v.boolean()
});

export type CreateContestInput = v.InferOutput<typeof CreateContestSchema>;
export type UpdateContestInput = v.InferOutput<typeof UpdateContestSchema>;

/**
 * Schema for adding groups to a contest
 */
export const AddGroupsToContestSchema = v.object({
	contestId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid contest ID')),
	groupIds: v.pipe(
		v.array(v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid group ID'))),
		v.minLength(1, 'At least one group must be selected')
	)
});

/**
 * Schema for removing groups from a contest
 */
export const RemoveGroupsFromContestSchema = v.object({
	contestId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid contest ID')),
	groupIds: v.pipe(
		v.array(v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid group ID'))),
		v.minLength(1, 'At least one group must be selected')
	)
});

/**
 * Schema for adding a task to a contest
 */
export const AddTaskToContestSchema = v.object({
	contestId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid contest ID')),
	taskId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid task ID'))
});

/**
 * Schema for removing a task from a contest
 */
export const RemoveTaskFromContestSchema = v.object({
	contestId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid contest ID')),
	taskId: v.pipe(v.number(), v.integer(), v.minValue(1, 'Invalid task ID'))
});

export type AddGroupsToContestInput = v.InferOutput<typeof AddGroupsToContestSchema>;
export type RemoveGroupsFromContestInput = v.InferOutput<typeof RemoveGroupsFromContestSchema>;
export type AddTaskToContestInput = v.InferOutput<typeof AddTaskToContestSchema>;
export type RemoveTaskFromContestInput = v.InferOutput<typeof RemoveTaskFromContestSchema>;
