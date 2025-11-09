# API Coverage Documentation

This document provides a comprehensive overview of the Mini-Maxit backend API endpoints (as defined in `swagger.yaml`) and their current integration status in the frontend.

**Last Updated:** 2025-11-09

---

## Summary Statistics

- **Total API Endpoints:** 60
- **Fully Integrated:** 20
- **Partially Integrated:** 2
- **Not Integrated:** 38
- **Coverage:** ~33%

---

## Coverage by Category

### ✅ Authentication (auth) - 100% Coverage
All authentication endpoints are fully integrated.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/auth/login` | POST | ✅ **DONE** | `AuthService.login()` |
| `/auth/logout` | POST | ✅ **DONE** | `AuthService.logout()` |
| `/auth/refresh` | POST | ✅ **DONE** | Handled in `ApiService` |
| `/auth/register` | POST | ✅ **DONE** | `AuthService.register()` |

**UI Implementation:**
- Login page: `/routes/(landing)/login/+page.svelte`
- Register page: `/routes/(landing)/register/+page.svelte`
- Logout: Remote function in `dashboard/logout.remote.ts`

---

### 🟡 Contests - 67% Coverage
Core contest viewing and registration features are implemented. Contest details endpoint is missing.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/contests` | GET | ✅ **DONE** | `ContestService.getOngoing/getUpcoming/getPast()` |
| `/contests/my` | GET | ✅ **DONE** | `ContestService.getMyContests()` |
| `/contests/{id}` | GET | ❌ **MISSING** | - |
| `/contests/{id}/register` | POST | ✅ **DONE** | `ContestService.registerForContest()` |
| `/contests/{id}/tasks/user-statistics` | GET | ✅ **DONE** | `ContestService.getContestTasksWithStatistics()` |
| `/contests/{id}/tasks/{task_id}` | GET | ✅ **DONE** | `ContestService.getContestTask()` |

**UI Implementation:**
- Contest listing: `dashboard/contests/+page.svelte`
- User contests: `dashboard/user/contests/+page.svelte`
- Contest details: `dashboard/user/contests/[contestId]/+page.svelte`
- Contest task view: `dashboard/user/contests/[contestId]/tasks/[taskId]/+page.svelte`

**Missing:**
- Get single contest by ID endpoint not integrated (may use list filtering instead)

---

### 🟡 Contests Management - 58% Coverage
Basic contest creation and task assignment implemented. Missing edit, delete, and submission viewing features.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/contests-management/contests` | POST | ✅ **DONE** | `ContestsManagementService.createContest()` |
| `/contests-management/contests/created` | GET | ✅ **DONE** | `ContestsManagementService.getCreatedContests()` |
| `/contests-management/contests/{id}` | PUT | ❌ **MISSING** | - |
| `/contests-management/contests/{id}` | DELETE | ❌ **MISSING** | - |
| `/contests-management/contests/{id}/registration-requests` | GET | ✅ **DONE** | `ContestsManagementService.getRegistrationRequests()` |
| `/contests-management/contests/{id}/registration-requests/{user_id}/approve` | POST | ✅ **DONE** | `ContestsManagementService.approveRegistrationRequest()` |
| `/contests-management/contests/{id}/registration-requests/{user_id}/reject` | POST | ✅ **DONE** | `ContestsManagementService.rejectRegistrationRequest()` |
| `/contests-management/contests/{id}/tasks` | GET | ✅ **DONE** | `ContestsManagementService.getContestTasks()` |
| `/contests-management/contests/{id}/tasks` | POST | ✅ **DONE** | `ContestsManagementService.addTaskToContest()` |
| `/contests-management/contests/{id}/tasks/assignable-tasks` | GET | ✅ **DONE** | `ContestsManagementService.getAssignableTasks()` |
| `/contests-management/contests/{id}/submissions` | GET | ❌ **MISSING** | - |

**UI Implementation:**
- Contest management: `dashboard/admin/contests/+page.svelte`
- Create contest: `CreateContestButton.svelte` component
- Registration requests: `dashboard/admin/contests/[contestId]/registration-requests/+page.svelte`
- Task assignment: `dashboard/admin/contests/[contestId]/tasks/+page.svelte`

**Missing:**
- Edit contest functionality
- Delete contest functionality
- View contest submissions (admin view)

---

### ❌ Groups - 0% Coverage
No group management endpoints are integrated. The groups UI shows only mock data.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/groups/` | GET | ❌ **MISSING** | - |
| `/groups/` | POST | ❌ **MISSING** | - |
| `/groups/{id}` | GET | ❌ **MISSING** | - |
| `/groups/{id}` | PUT | ❌ **MISSING** | - |
| `/groups/{id}/users` | GET | ❌ **MISSING** | - |
| `/groups/{id}/users` | POST | ❌ **MISSING** | - |
| `/groups/{id}/users` | DELETE | ❌ **MISSING** | - |

**UI Implementation:**
- User groups page: `dashboard/user/groups/+page.svelte` (MOCK DATA ONLY)
- Admin groups page: `dashboard/admin/groups/+page.svelte` (EMPTY FILE)

**Notes:**
- Groups feature is completely unimplemented
- UI exists but uses hardcoded mock data

---

### 🟡 Submissions - 27% Coverage
Basic submission functionality (submit solution, get languages, get my submissions) is implemented. Most filtering and viewing endpoints are missing.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/submissions` | GET | ❌ **MISSING** | - |
| `/submissions/submit` | POST | ✅ **DONE** | `SubmissionService.submitSolution()` |
| `/submissions/languages` | GET | ✅ **DONE** | `SubmissionService.getAvailableLanguages()` |
| `/submissions/my` | GET | ✅ **DONE** | `SubmissionService.getMySubmissions()` |
| `/submissions/{id}` | GET | ❌ **MISSING** | - |
| `/submissions/users/{id}` | GET | ❌ **MISSING** | - |
| `/submissions/tasks/{id}` | GET | ❌ **MISSING** | - |
| `/submissions/groups/{id}` | GET | ❌ **MISSING** | - |

**UI Implementation:**
- Submit solution: Forms in task detail pages (both contest and standalone tasks)
- My submissions: `dashboard/user/submissions/+page.svelte`
- Remote functions: `submit.remote.ts` files in task pages

**Missing:**
- Get submissions with filters (general endpoint)
- Get submission by ID (for viewing details)
- Get submissions by user ID (teacher/admin view)
- Get submissions by task ID (teacher/admin view)
- Get submissions by group ID (teacher/admin view)

---

### 🟡 Tasks - 67% Coverage
Basic task listing and viewing implemented. Missing "my tasks" endpoint.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/tasks` | GET | ✅ **DONE** | `TaskService.getAllTasks()` |
| `/tasks/{id}` | GET | ✅ **DONE** | `TaskService.getTaskById()` |
| `/tasks/my` | GET | ❌ **MISSING** | - |

**UI Implementation:**
- All tasks: `dashboard/tasks/+page.svelte`
- Task details: `dashboard/tasks/[taskId]/+page.svelte`
- User tasks: `dashboard/user/tasks/+page.svelte` (uses `/tasks` not `/tasks/my`)

**Missing:**
- Get my assigned tasks endpoint (specific to user)

---

### 🟡 Tasks Management - 56% Coverage
Core task upload and limit management implemented. Missing delete, update, and assignment features.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/tasks-management/tasks/` | POST | ✅ **DONE** | `TasksManagementService.uploadTask()` |
| `/tasks-management/tasks/created` | GET | ✅ **DONE** | `TasksManagementService.getCreatedTasks()` |
| `/tasks-management/tasks/{id}` | DELETE | ❌ **MISSING** | - |
| `/tasks-management/tasks/{id}` | PATCH | ❌ **MISSING** | - |
| `/tasks-management/tasks/{id}/limits` | GET | ✅ **DONE** | `TasksManagementService.getTaskLimits()` |
| `/tasks-management/tasks/{id}/limits` | PUT | ✅ **DONE** | `TasksManagementService.updateTaskLimits()` |
| `/tasks-management/tasks/{id}/assign/groups` | POST | ❌ **MISSING** | - |
| `/tasks-management/tasks/{id}/assign/users` | POST | ❌ **MISSING** | - |
| `/tasks-management/tasks/{id}/unassign/groups` | POST | ❌ **MISSING** | - |
| `/tasks-management/tasks/{id}/unassign/users` | POST | ❌ **MISSING** | - |

**UI Implementation:**
- Admin tasks: `dashboard/admin/tasks/+page.svelte`
- Upload task: `TasksUploadDialog.svelte` component
- Manage limits: `ManageTestCasesLimitsDialog.svelte` component

**Missing:**
- Delete task functionality
- Update/edit task functionality
- Assign tasks to groups
- Assign tasks to users
- Unassign tasks from groups/users

---

### ❌ Users - 33% Coverage
Only basic user profile viewing and password change implemented. Missing user listing and editing.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/users/` | GET | ❌ **MISSING** | - |
| `/users/me` | GET | ✅ **DONE** | `UserService.getCurrentUser()` |
| `/users/{id}` | GET | ❌ **MISSING** | - |
| `/users/{id}` | PATCH | ❌ **MISSING** | - |
| `/users/{id}/password` | PATCH | ✅ **DONE** | `UserService.changePassword()` |

**UI Implementation:**
- User profile: `dashboard/user/profile/+page.svelte`
- Change password: Integrated in profile page

**Missing:**
- List all users (admin functionality)
- Get user by ID
- Edit user details (admin functionality)

---

### ❌ Workers - 0% Coverage
Worker status monitoring not implemented.

| Endpoint | Method | Status | Frontend Implementation |
|----------|--------|--------|------------------------|
| `/workers/status` | GET | ❌ **MISSING** | - |

**Notes:**
- Worker status endpoint exists for monitoring submission processing
- No UI or service integration exists

---

## Implementation Status by Feature Area

### Landing & Authentication ✅ Complete
- [x] Login page with validation
- [x] Registration page with validation
- [x] Logout functionality
- [x] Token refresh (automatic in ApiService)

### User Dashboard 🟡 Partial
- [x] View user profile
- [x] Change password
- [x] View my contests (ongoing/upcoming/past)
- [x] View contest details with tasks
- [x] View task details in contests
- [x] Submit solutions to tasks
- [x] View my submissions
- [ ] View my assigned tasks (using global tasks instead)
- [ ] Edit profile information
- [ ] View detailed submission results

### Contest Participation 🟡 Partial
- [x] Browse public contests (ongoing/upcoming/past)
- [x] Register for contests
- [x] View contest tasks with statistics
- [x] Submit solutions in contest context
- [ ] View contest by ID directly
- [ ] View contest leaderboards

### Task Viewing 🟡 Partial
- [x] Browse all global tasks
- [x] View task details
- [x] Submit solutions to standalone tasks
- [ ] View tasks assigned specifically to me
- [ ] Filter tasks by group

### Admin - Contest Management 🟡 Partial
- [x] Create new contests
- [x] View created contests
- [x] Add tasks to contests
- [x] View registration requests
- [x] Approve/reject registration requests
- [ ] Edit contest details
- [ ] Delete contests
- [ ] View contest submissions
- [ ] Manage contest visibility/settings

### Admin - Task Management 🟡 Partial
- [x] Upload new tasks
- [x] View created tasks
- [x] Manage task test case limits
- [ ] Edit task details
- [ ] Delete tasks
- [ ] Assign tasks to groups
- [ ] Assign tasks to users
- [ ] Unassign tasks

### Admin - Group Management ❌ Not Started
- [ ] Create groups
- [ ] List groups
- [ ] View group details
- [ ] Edit groups
- [ ] Add users to groups
- [ ] Remove users from groups
- [ ] View group submissions

### Admin - User Management ❌ Not Started
- [ ] List all users
- [ ] View user details
- [ ] Edit user information
- [ ] Change user roles
- [ ] View user submissions (admin view)

### Admin - Submission Monitoring ❌ Not Started
- [ ] View all submissions with filters
- [ ] View submission details
- [ ] View submissions by user
- [ ] View submissions by task
- [ ] View submissions by group
- [ ] View submissions by contest
- [ ] Monitor worker status

---

## Service Layer Implementation

### Existing Services

1. **ApiService** (`src/lib/services/ApiService.ts`)
   - HTTP client wrapper
   - Automatic token refresh
   - Error handling
   - Cookie management

2. **AuthService** (`src/lib/services/AuthService.ts`)
   - Login, register, logout
   - **Complete** for auth endpoints

3. **ContestService** (`src/lib/services/ContestService.ts`)
   - Contest listing (ongoing/upcoming/past)
   - User contests
   - Contest registration
   - Contest tasks with statistics
   - **Missing:** Get contest by ID

4. **ContestsManagementService** (`src/lib/services/ContestsManagementService.ts`)
   - Create contests
   - Get created contests
   - Registration request management
   - Task assignment to contests
   - **Missing:** Edit, delete contests, view submissions

5. **SubmissionService** (`src/lib/services/SubmissionService.ts`)
   - Submit solutions
   - Get languages
   - Get my submissions
   - **Missing:** All other submission filtering endpoints

6. **TaskService** (`src/lib/services/TaskService.ts`)
   - Get all tasks
   - Get task by ID
   - **Missing:** Get my assigned tasks

7. **TasksManagementService** (`src/lib/services/TasksManagementService.ts`)
   - Upload tasks
   - Get created tasks
   - Manage task limits
   - **Missing:** Delete, update, assign/unassign tasks

8. **UserService** (`src/lib/services/UserService.ts`)
   - Get current user
   - Change password
   - **Missing:** List users, get user by ID, edit users

### Missing Services

- **GroupService** - Not created (0% implementation)
- **WorkerService** - Not created (0% implementation)

---

## Route Structure Overview

### Landing Routes
```
/                          - Landing/home page
/(landing)/login           - Login page ✅
/(landing)/register        - Register page ✅
```

### Dashboard Routes
```
/dashboard                            - Dashboard home ✅
/dashboard/contests                   - Browse contests ✅
/dashboard/tasks                      - Browse tasks ✅
/dashboard/tasks/[taskId]             - Task detail ✅

/dashboard/user                       - User section
  /contests                           - User contests ✅
  /contests/[contestId]               - Contest detail ✅
  /contests/[contestId]/tasks/[taskId] - Contest task ✅
  /groups                             - User groups (MOCK DATA)
  /profile                            - User profile ✅
  /submissions                        - User submissions ✅
  /tasks                              - User tasks ✅
  /tasks/[taskId]                     - User task detail ✅

/dashboard/admin                      - Admin section
  /contests                           - Manage contests ✅
  /contests/[contestId]/registration-requests  - Reg requests ✅
  /contests/[contestId]/tasks         - Contest tasks ✅
  /groups                             - Manage groups (EMPTY)
  /tasks                              - Manage tasks ✅
```

---

## Notes and Observations

### Strengths
- Core contest workflow is functional (browse → register → view tasks → submit)
- Authentication and session management is robust
- Task management basics are in place
- Code structure is clean with proper service abstraction

### Gaps
- **Groups feature** is completely missing (major gap for class/cohort management)
- **User management** endpoints not integrated (blocking admin functionality)
- **Submission viewing/monitoring** is limited (can't view others' submissions)
- **Contest editing** not available (can create but not modify)
- **Task editing** not available (can create but not modify)
- **Worker monitoring** not integrated (no visibility into processing status)

### Technical Debt
- Groups page has mock data that should be replaced
- Some DTO types may be incomplete (e.g., TaskWithContestStats fields)
- No error boundaries for service failures
- Limited pagination support in list views

---

## Recommended Priority Order

See `PRIORITY_TODO.md` for detailed action items prioritized by criticality to contest workflow.
