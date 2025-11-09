# Frontend Priority TODO List

This document outlines the prioritized action items for the Mini-Maxit frontend, organized by criticality to the platform's core contest workflow.

**Last Updated:** 2025-11-09

---

## Priority Levels

- **🔴 CRITICAL** - Blocking core contest workflow, must be implemented ASAP
- **🟠 HIGH** - Important for usability and admin functions, needed soon
- **🟡 MEDIUM** - Enhances functionality, should be implemented
- **🟢 LOW** - Nice-to-have features, can be deferred

---

## 🔴 CRITICAL Priority (Core Contest Workflow Blockers)

These features are essential for the basic contest workflow to function properly.

### 1. 🔴 View Detailed Submission Results
**Endpoint:** `GET /submissions/{id}`  
**Impact:** Users can submit solutions but cannot see detailed results (test case outcomes, error messages, etc.)  
**Current State:** Only submission list is viewable, no detail view  
**Required For:** Students need to understand why their submissions failed  
**Files to Create/Modify:**
- `src/lib/services/SubmissionService.ts` - Add `getSubmissionById()` method
- `src/lib/dto/submission.ts` - Verify/add SubmissionResult and TestResult types
- `src/routes/dashboard/user/submissions/[id]/+page.svelte` - New page for submission details
- Update submission list to link to detail pages

**Functional Goal:** Allow users to click on a submission and see:
- Overall status and result code
- Individual test case results (pass/fail)
- Execution times and memory usage (if available)
- Any error messages

---

### 2. 🔴 View My Assigned Tasks
**Endpoint:** `GET /tasks/my`  
**Impact:** Students cannot see tasks specifically assigned to them  
**Current State:** `/dashboard/user/tasks` shows all global tasks, not personalized assignments  
**Required For:** Teachers need ability to assign specific tasks to students/groups  
**Files to Modify:**
- `src/lib/services/TaskService.ts` - Add `getMyTasks()` method
- `src/routes/dashboard/user/tasks/+page.svelte` - Switch to use `/tasks/my` endpoint
- Consider keeping "All Tasks" as separate tab/section

**Functional Goal:** Show students only the tasks assigned to them by teachers, separate from global task pool

---

### 3. 🔴 Edit Contest Details
**Endpoint:** `PUT /contests-management/contests/{id}`  
**Impact:** Contest creators cannot modify contest settings after creation  
**Current State:** Can create contests but not edit them  
**Required For:** Fixing typos, adjusting dates, changing registration/submission settings  
**Files to Modify:**
- `src/lib/services/ContestsManagementService.ts` - Add `updateContest()` method
- `src/lib/dto/contest.ts` - Add EditContestDto if not present
- `src/routes/dashboard/admin/contests/+page.svelte` - Add edit button/dialog
- Create `EditContestDialog.svelte` component (similar to CreateContestButton)

**Functional Goal:** Allow contest creators to edit:
- Contest name, description
- Start and end dates
- Registration open/closed
- Submission open/closed
- Visibility settings

---

### 4. 🔴 Delete Contest
**Endpoint:** `DELETE /contests-management/contests/{id}`  
**Impact:** Cannot remove test contests or incorrect entries  
**Current State:** Contests are permanent once created  
**Required For:** Cleanup and testing  
**Files to Modify:**
- `src/lib/services/ContestsManagementService.ts` - Add `deleteContest()` method
- `src/routes/dashboard/admin/contests/+page.svelte` - Add delete button with confirmation
- Add confirmation dialog component

**Functional Goal:** Allow contest creators to delete contests they created (with appropriate warnings)

---

## 🟠 HIGH Priority (Critical Admin Functions)

These features are needed for effective platform administration and teaching.

### 5. 🟠 Complete Group Management System
**Endpoints:**
- `GET /groups/` - List all groups
- `POST /groups/` - Create group
- `GET /groups/{id}` - Get group details
- `PUT /groups/{id}` - Edit group
- `GET /groups/{id}/users` - Get group members
- `POST /groups/{id}/users` - Add users to group
- `DELETE /groups/{id}/users` - Remove users from group

**Impact:** Group feature is completely non-functional (shows mock data)  
**Current State:** Groups UI exists but has no backend integration  
**Required For:** Managing classes, cohorts, teams  
**Files to Create/Modify:**
- `src/lib/services/GroupService.ts` - NEW: Create complete service
- `src/lib/dto/group.ts` - NEW: Create group DTOs
- `src/routes/dashboard/admin/groups/+page.svelte` - Implement from scratch
- `src/routes/dashboard/user/groups/+page.svelte` - Replace mock data with real API calls
- Create group management components (CreateGroup, EditGroup, ManageMembers)

**Functional Goal:** 
- Teachers can create and manage groups
- Teachers can add/remove students from groups
- Students can see their groups
- Support for assigning tasks to entire groups
- Support for viewing group submissions

---

### 6. 🟠 View Contest Submissions (Admin)
**Endpoint:** `GET /contests-management/contests/{id}/submissions`  
**Impact:** Contest creators cannot monitor participant submissions  
**Current State:** No way to view submissions for a contest  
**Required For:** Monitoring contest progress, identifying issues  
**Files to Modify:**
- `src/lib/services/ContestsManagementService.ts` - Add `getContestSubmissions()` method
- Create `src/routes/dashboard/admin/contests/[contestId]/submissions/+page.svelte`
- Add submissions tab to contest management UI

**Functional Goal:** 
- View all submissions for a contest
- Filter by user, task, status
- Export submissions data
- Monitor submission patterns

---

### 7. 🟠 Task Assignment to Users/Groups
**Endpoints:**
- `POST /tasks-management/tasks/{id}/assign/groups`
- `POST /tasks-management/tasks/{id}/assign/users`
- `POST /tasks-management/tasks/{id}/unassign/groups`
- `POST /tasks-management/tasks/{id}/unassign/users`

**Impact:** Cannot assign tasks outside of contests  
**Current State:** Tasks can only be added to contests, not directly assigned  
**Required For:** Homework assignments, individualized practice  
**Files to Modify:**
- `src/lib/services/TasksManagementService.ts` - Add assign/unassign methods
- `src/routes/dashboard/admin/tasks/+page.svelte` - Add assignment UI
- Create task assignment dialog component

**Functional Goal:**
- Assign tasks to specific users
- Assign tasks to groups
- Unassign tasks
- View who has access to each task

---

### 8. 🟠 Edit and Delete Tasks
**Endpoints:**
- `PATCH /tasks-management/tasks/{id}` - Update task
- `DELETE /tasks-management/tasks/{id}` - Delete task

**Impact:** Cannot fix task issues or remove bad uploads  
**Current State:** Tasks are permanent once uploaded  
**Required For:** Maintaining task quality  
**Files to Modify:**
- `src/lib/services/TasksManagementService.ts` - Add `updateTask()` and `deleteTask()` methods
- `src/routes/dashboard/admin/tasks/+page.svelte` - Add edit and delete buttons
- Create edit task dialog (reupload archive and/or change title)

**Functional Goal:**
- Update task title
- Replace task archive (description PDF, test cases)
- Delete tasks (with cascade warnings if used in contests)

---

### 9. 🟠 User Management (Admin)
**Endpoints:**
- `GET /users/` - List all users
- `GET /users/{id}` - Get user by ID
- `PATCH /users/{id}` - Edit user

**Impact:** Admins cannot manage user accounts  
**Current State:** No user management UI exists  
**Required For:** Managing student/teacher accounts, changing roles  
**Files to Create/Modify:**
- `src/lib/services/UserService.ts` - Add admin methods
- `src/lib/dto/user.ts` - Add UserEdit type if missing
- `src/routes/dashboard/admin/users/+page.svelte` - NEW: Create user management page
- Create user list, search, edit components

**Functional Goal:**
- List all users with search/filter
- View user details
- Edit user information (name, email, role)
- Change user roles (student ↔ teacher ↔ admin)

---

## 🟡 MEDIUM Priority (Enhanced Functionality)

These features improve the user experience and provide better insights.

### 10. 🟡 View Submissions by User (Teacher View)
**Endpoint:** `GET /submissions/users/{id}`  
**Impact:** Teachers cannot review individual student progress  
**Current State:** No way to view another user's submissions  
**Required For:** Student progress monitoring, grading  
**Files to Modify:**
- `src/lib/services/SubmissionService.ts` - Add `getUserSubmissions()` method
- Create student profile view for teachers
- Add to user management page

**Functional Goal:** Allow teachers to view submission history for any student

---

### 11. 🟡 View Submissions by Task (Teacher View)
**Endpoint:** `GET /submissions/tasks/{id}`  
**Impact:** Teachers cannot see all submissions for a specific task  
**Current State:** No task-level submission overview  
**Required For:** Identifying difficult tasks, common errors  
**Files to Modify:**
- `src/lib/services/SubmissionService.ts` - Add `getTaskSubmissions()` method
- Add submissions tab to task detail pages (teacher view)

**Functional Goal:** View all submissions for a task with statistics (pass rate, common errors)

---

### 12. 🟡 View Submissions by Group (Teacher View)
**Endpoint:** `GET /submissions/groups/{id}`  
**Impact:** Cannot monitor group performance  
**Current State:** No group-level submission tracking  
**Required For:** Group progress monitoring  
**Files to Modify:**
- `src/lib/services/SubmissionService.ts` - Add `getGroupSubmissions()` method
- Add to group detail page

**Functional Goal:** View all submissions from group members

---

### 13. 🟡 General Submission Filtering
**Endpoint:** `GET /submissions` (with filters)  
**Impact:** Limited submission search capabilities  
**Current State:** Can only view "my submissions"  
**Required For:** Advanced submission analysis  
**Files to Modify:**
- `src/lib/services/SubmissionService.ts` - Add `getSubmissions()` with filters
- Create admin submission dashboard

**Functional Goal:** Search/filter submissions by:
- User ID
- Contest ID
- Task ID
- Status
- Date range

---

### 14. 🟡 Get Contest by ID
**Endpoint:** `GET /contests/{id}`  
**Impact:** May be using inefficient list filtering  
**Current State:** Contest details may be fetched from lists instead of direct lookup  
**Required For:** Performance optimization  
**Files to Modify:**
- `src/lib/services/ContestService.ts` - Add `getContestById()` method
- Review contest detail pages to use direct lookup

**Functional Goal:** Fetch single contest efficiently by ID

---

## 🟢 LOW Priority (Nice-to-Have Features)

These features can be implemented later for enhanced user experience.

### 15. 🟢 Worker Status Monitoring
**Endpoint:** `GET /workers/status`  
**Impact:** No visibility into submission processing system  
**Current State:** Not integrated  
**Required For:** System monitoring, debugging slow evaluations  
**Files to Create/Modify:**
- `src/lib/services/WorkerService.ts` - NEW: Create service
- `src/lib/dto/worker.ts` - NEW: Create WorkerStatus type
- `src/routes/dashboard/admin/system/+page.svelte` - NEW: System monitoring page

**Functional Goal:** 
- Display worker node status
- Show busy vs idle workers
- Monitor submission queue

---

### 16. 🟢 Contest Leaderboards
**Endpoint:** May need new endpoint (not in swagger)  
**Impact:** No competitive element visible  
**Current State:** Not implemented  
**Required For:** Contest engagement  
**Files to Create/Modify:**
- Backend may need new endpoint for leaderboard data
- Create leaderboard component
- Add to contest detail pages

**Functional Goal:** Show contest rankings based on task completion and scores

---

### 17. 🟢 User Profile Editing
**Endpoint:** `PATCH /users/{id}` (for self)  
**Impact:** Users cannot update their own profile information  
**Current State:** Can view profile and change password only  
**Required For:** User autonomy  
**Files to Modify:**
- `src/lib/services/UserService.ts` - Add `updateCurrentUser()` method
- `src/routes/dashboard/user/profile/+page.svelte` - Add edit functionality

**Functional Goal:** Allow users to update their name, email, username

---

### 18. 🟢 Pagination Support
**Endpoint:** All list endpoints support limit/offset/sort  
**Impact:** Performance issues with large datasets  
**Current State:** Pagination parameters not used consistently  
**Required For:** Scalability  
**Files to Modify:**
- All service methods that return lists
- All list pages to add pagination controls

**Functional Goal:** Implement pagination across all list views

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1-2)
Focus on items #1-4 to make the contest workflow complete and functional.

**Deliverables:**
- ✅ Submission detail view
- ✅ My assigned tasks
- ✅ Edit contests
- ✅ Delete contests

**Impact:** Makes platform minimally viable for running contests

---

### Phase 2: Admin Essentials (Week 3-4)
Focus on items #5-9 to enable proper platform administration.

**Deliverables:**
- ✅ Complete groups system
- ✅ Contest submission monitoring
- ✅ Task assignment system
- ✅ Task editing/deletion
- ✅ User management

**Impact:** Enables teachers to effectively manage courses and students

---

### Phase 3: Enhanced Features (Week 5-6)
Focus on items #10-14 for better monitoring and insights.

**Deliverables:**
- ✅ Submission viewing by user/task/group
- ✅ Advanced submission filtering
- ✅ Performance optimizations

**Impact:** Provides better insights into student progress

---

### Phase 4: Polish (Week 7+)
Focus on items #15-18 for system reliability and user experience.

**Deliverables:**
- ✅ Worker monitoring
- ✅ Leaderboards
- ✅ Profile editing
- ✅ Pagination

**Impact:** Enhances overall platform quality

---

## Testing Requirements

For each implemented feature:

1. **Unit Tests**
   - Service methods
   - DTO validation
   - Error handling

2. **Integration Tests**
   - API endpoint calls
   - Data flow through service layer
   - Error scenarios

3. **UI Tests**
   - Form validation
   - User interactions
   - Responsive design

4. **Manual Testing Checklist**
   - Happy path workflows
   - Edge cases
   - Permission checks (student/teacher/admin)
   - Error messages are user-friendly

---

## Development Guidelines

### Before Starting Each Feature

1. **Review API specification** in swagger.yaml
2. **Check existing DTOs** - may need updates
3. **Plan service layer changes** first
4. **Design UI mockup** if needed
5. **Consider permissions** - who can access this?

### Code Quality Standards

- Use TypeScript strict mode
- Follow existing service patterns
- Implement proper error handling
- Add loading states to UI
- Show user-friendly error messages
- Use Valibot for form validation
- Follow Svelte 5 runes conventions
- Use remote functions for server actions

### Service Layer Pattern

```typescript
// In service class
async methodName(params): Promise<ReturnType> {
  try {
    const response = await this.apiClient.method<ApiResponse<Type>>({
      url: '/endpoint',
      body: params
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Operation failed:', error.toJSON());
      throw error;
    }
    throw error;
  }
}
```

### Component Pattern

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Implement loading and error states
- Use async components when appropriate

---

## Questions for Product Owner

1. **Groups:** Should groups have hierarchies (e.g., class → section)?
2. **Submissions:** Should students see other students' submissions in contests?
3. **Leaderboards:** Real-time or computed periodically?
4. **Tasks:** Should task deletion be soft-delete (archived) or hard-delete?
5. **Contests:** Should there be draft/published states?
6. **Permissions:** Do we need more granular permissions beyond student/teacher/admin?

---

## Risks and Dependencies

### Technical Risks
- **Groups implementation** is complex - affects tasks, submissions, contests
- **Submission viewing** may have performance issues with large datasets
- **Real-time updates** may need WebSocket implementation for worker status

### Dependencies
- Backend API must be stable and match swagger spec
- Database performance for large submission queries
- File storage service for task archives
- Worker service for submission evaluation

### Migration Concerns
- Existing mock data in groups page must be replaced
- Any cached data or local state may need cleanup
- Users may have bookmarks to old URLs

---

## Success Metrics

### Phase 1 Success Criteria
- Contest workflow is complete end-to-end
- Students can submit and see detailed results
- Teachers can create and modify contests

### Phase 2 Success Criteria
- Groups system is fully functional
- Teachers can assign tasks outside contests
- User management is operational

### Overall Success
- 80%+ API endpoint coverage
- All critical user workflows functional
- Admin can manage platform without dev intervention
- System is ready for production use with real students

---

## Notes

- This is a living document - update as priorities change
- Check swagger.yaml for any API changes
- Coordinate with backend team on new endpoint needs
- Consider user feedback when prioritizing features
- Some features may need new backend endpoints (e.g., leaderboards)

