/**
 * Client-side service exports
 * All services for browser-based API calls
 */

export { ApiService } from './ApiService';
export { AuthService } from './AuthService';
export { UserService } from './UserService';
export { TaskService } from './TaskService';
export { ContestService } from './ContestService';
export { SubmissionService } from './SubmissionService';
export { TasksManagementService } from './TasksManagementService';
export { ContestsManagementService } from './ContestsManagementService';
export { GroupsManagementService } from './GroupsManagementService';
export { AccessControlService} from './AccessControlService';
export { WorkerService } from './WorkerService';

// Re-export service instance getters for convenience
export {
	getApiInstance,
	getAuthInstance,
	getUserInstance,
	getTaskInstance,
	getContestInstance,
	getSubmissionInstance,
	getTasksManagementInstance,
	getContestsManagementInstance,
	getGroupsManagementInstance,
	getAccessControlInstance,
	getWorkerInstance
} from '$lib/stores/service-instances.svelte';
