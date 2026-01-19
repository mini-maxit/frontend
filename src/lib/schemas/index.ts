// Auth schemas
export { LoginSchema, RegisterSchema, type LoginInput, type RegisterInput } from './auth';

// Submission schemas
export {
	SubmitSolutionSchema,
	SubmitContestSolutionSchema,
	type SubmitSolutionInput,
	type SubmitContestSolutionInput
} from './submission';

// User schemas
export {
	ChangePasswordSchema,
	UpdateUserSchema,
	type ChangePasswordInput,
	type UpdateUserInput
} from './user';

// Task schemas
export {
	UploadTaskSchema,
	UpdateTaskLimitsSchema,
	type UploadTaskInput,
	type UpdateTaskLimitsInput
} from './task';

// Group schemas
export {
	CreateGroupSchema,
	UpdateGroupSchema,
	AddUsersToGroupSchema,
	RemoveUsersFromGroupSchema,
	type CreateGroupInput,
	type UpdateGroupInput,
	type AddUsersToGroupInput,
	type RemoveUsersFromGroupInput
} from './group';

// Contest schemas
export {
	CreateContestSchema,
	UpdateContestSchema,
	AddGroupsToContestSchema,
	RemoveGroupsFromContestSchema,
	AddTaskToContestSchema,
	RemoveTaskFromContestSchema,
	type CreateContestInput,
	type UpdateContestInput,
	type AddGroupsToContestInput,
	type RemoveGroupsFromContestInput,
	type AddTaskToContestInput,
	type RemoveTaskFromContestInput
} from './contest';

// Collaborator schemas
export {
	AddCollaboratorSchema,
	UpdateCollaboratorSchema,
	RemoveCollaboratorSchema,
	type AddCollaboratorInput,
	type UpdateCollaboratorInput,
	type RemoveCollaboratorInput
} from './collaborator';
