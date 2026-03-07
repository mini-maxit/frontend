// Re-export all services from api directory
export { ApiService } from './api/ApiService';
export { AuthService } from './api/AuthService';
export { UserService } from './api/UserService';
export { UserManagementService } from './api/UserManagementService';
export { TaskService } from './api/TaskService';
export { ContestService } from './api/ContestService';
export { SubmissionService } from './api/SubmissionService';
export { TasksManagementService } from './api/TasksManagementService';
export { ContestsManagementService } from './api/ContestsManagementService';
export { GroupsManagementService } from './api/GroupsManagementService';
export { AccessControlService } from './api/AccessControlService';
export { WorkerService } from './api/WorkerService';

// Re-export ApiError from base service
export { ApiError } from './ApiService';

// Re-export service instance getters
export {
  getApiInstance,
  getAuthInstance,
  getUserInstance,
  getUserManagementInstance,
  getTaskInstance,
  getContestInstance,
  getSubmissionInstance,
  getTasksManagementInstance,
  getContestsManagementInstance,
  getGroupsManagementInstance,
  getAccessControlInstance,
  getWorkerInstance
} from '../stores/service-instances.svelte';
