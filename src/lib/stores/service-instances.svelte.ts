import { browser } from '$app/environment';
import { ApiService } from '../services/api/ApiService';
import { AuthService } from '../services/api/AuthService';
import { UserService } from '../services/api/UserService';
import { UserManagementService } from '../services/api/UserManagementService';
import { TaskService } from '../services/api/TaskService';
import { ContestService } from '../services/api/ContestService';
import { SubmissionService } from '../services/api/SubmissionService';
import { TasksManagementService } from '../services/api/TasksManagementService';
import { ContestsManagementService } from '../services/api/ContestsManagementService';
import { GroupsManagementService } from '../services/api/GroupsManagementService';
import { AccessControlService } from '../services/api/AccessControlService';
import { WorkerService } from '../services/api/WorkerService';
import { env } from '$env/dynamic/public';

/**
 * Global singleton instance of ApiService
 * Reused across all client-side services and components
 */
let apiInstance: ApiService | null = $state(null);

/**
 * Global singleton instance of AuthService
 * Reused across all client-side components
 */
let authInstance: AuthService | null = $state(null);

/**
 * Global singleton instance of UserService
 * Reused across all client-side components
 */
let userInstance: UserService | null = $state(null);

/**
 * Global singleton instance of UserManagementService
 * Reused across all admin components for user management
 */
let userManagementInstance: UserManagementService | null = $state(null);

/**
 * Global singleton instance of TaskService
 */
let taskInstance: TaskService | null = $state(null);

/**
 * Global singleton instance of ContestService
 */
let contestInstance: ContestService | null = $state(null);

/**
 * Global singleton instance of SubmissionService
 */
let submissionInstance: SubmissionService | null = $state(null);

/**
 * Global singleton instance of TasksManagementService
 */
let tasksManagementInstance: TasksManagementService | null = $state(null);

/**
 * Global singleton instance of ContestsManagementService
 */
let contestsManagementInstance: ContestsManagementService | null = $state(null);

/**
 * Global singleton instance of GroupsManagementService
 */
let groupsManagementInstance: GroupsManagementService | null = $state(null);

/**
 * Global singleton instance of AccessControlService
 */
let accessControlInstance: AccessControlService | null = $state(null);

/**
 * Global singleton instance of WorkerService
 */
let workerInstance: WorkerService | null = $state(null);

/**
 * Get or create the global ApiService instance
 * This ensures a single instance is shared across the application
 */
export function getApiInstance(): ApiService | null {
  if (!browser) {
    return null;
  }

  if (!apiInstance) {
    const apiUrl = env.PUBLIC_BACKEND_API_URL;
    if (!apiUrl) {
      console.error('PUBLIC_BACKEND_API_URL is not defined');
      return null;
    }
    apiInstance = new ApiService(apiUrl);
  }

  return apiInstance;
}

/**
 * Get or create the global AuthService instance
 * This ensures a single instance is shared across the application
 */
export function getAuthInstance(): AuthService | null {
  if (!browser) {
    return null;
  }

  if (!authInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    authInstance = new AuthService(apiClient);
  }

  return authInstance;
}

/**
 * Get or create the global UserService instance
 * This ensures a single instance is shared across the application
 */
export function getUserInstance(): UserService | null {
  if (!browser) {
    return null;
  }

  if (!userInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    userInstance = new UserService(apiClient);
  }

  return userInstance;
}

/**
 * Get or create the global UserManagementService instance
 * This ensures a single instance is shared across the application
 */
export function getUserManagementInstance(): UserManagementService | null {
  if (!browser) {
    return null;
  }

  if (!userManagementInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    userManagementInstance = new UserManagementService(apiClient);
  }

  return userManagementInstance;
}

/**
 * Get or create the global TaskService instance
 */
export function getTaskInstance(): TaskService | null {
  if (!browser) {
    return null;
  }

  if (!taskInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    taskInstance = new TaskService(apiClient);
  }

  return taskInstance;
}

/**
 * Get or create the global ContestService instance
 */
export function getContestInstance(): ContestService | null {
  if (!browser) {
    return null;
  }

  if (!contestInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    contestInstance = new ContestService(apiClient);
  }

  return contestInstance;
}

/**
 * Get or create the global SubmissionService instance
 */
export function getSubmissionInstance(): SubmissionService | null {
  if (!browser) {
    return null;
  }

  if (!submissionInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    submissionInstance = new SubmissionService(apiClient);
  }

  return submissionInstance;
}

/**
 * Get or create the global TasksManagementService instance
 */
export function getTasksManagementInstance(): TasksManagementService | null {
  if (!browser) {
    return null;
  }

  if (!tasksManagementInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    tasksManagementInstance = new TasksManagementService(apiClient);
  }

  return tasksManagementInstance;
}

/**
 * Get or create the global ContestsManagementService instance
 */
export function getContestsManagementInstance(): ContestsManagementService | null {
  if (!browser) {
    return null;
  }

  if (!contestsManagementInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    contestsManagementInstance = new ContestsManagementService(apiClient);
  }

  return contestsManagementInstance;
}

/**
 * Get or create the global GroupsManagementService instance
 */
export function getGroupsManagementInstance(): GroupsManagementService | null {
  if (!browser) {
    return null;
  }

  if (!groupsManagementInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    groupsManagementInstance = new GroupsManagementService(apiClient);
  }

  return groupsManagementInstance;
}

/**
 * Get or create the global AccessControlService instance
 */
export function getAccessControlInstance(): AccessControlService | null {
  if (!browser) {
    return null;
  }

  if (!accessControlInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    accessControlInstance = new AccessControlService(apiClient);
  }

  return accessControlInstance;
}

/**
 * Get or create the global WorkerService instance
 */
export function getWorkerInstance(): WorkerService | null {
  if (!browser) {
    return null;
  }

  if (!workerInstance) {
    const apiClient = getApiInstance();
    if (!apiClient) {
      return null;
    }
    workerInstance = new WorkerService(apiClient);
  }

  return workerInstance;
}
