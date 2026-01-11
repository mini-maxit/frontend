import { AppRoutes } from '$lib/routes';
import { delocalizePath } from '$lib/routes';
import { m } from '$lib/paraglide/messages.js';

export function getDashboardTitleTranslationFromPathname(pathname: string): string {
  const path = delocalizePath(pathname);

  // Map dashboard routes to their translation keys
  const routeTitleMap: Record<string, () => string> = {
    [AppRoutes.Dashboard]: () => m.header_dashboard(),
    [AppRoutes.UserSubmissions]: () => m.sidebar_your_submissions(),
    [AppRoutes.UserContests]: () => m.sidebar_your_contests(),
    [AppRoutes.UserTasks]: () => m.sidebar_your_tasks(),
    [AppRoutes.UserProfile]: () => m.sidebar_profile(),
    [AppRoutes.AvailableContests]: () => m.sidebar_available_contests(),
    [AppRoutes.AvailableTasks]: () => m.sidebar_available_tasks(),
    [AppRoutes.Admin]: () => m.sidebar_admin(),
    [AppRoutes.TeacherContests]: () => m.sidebar_admin_contests(),
    [AppRoutes.TeacherGroups]: () => m.groups_management_title(),
    [AppRoutes.TeacherTasks]: () => m.sidebar_admin_tasks(),
    [AppRoutes.AdminUsers]: () => m.admin_users_title()
  };

  // Check for dynamic routes (e.g., /dashboard/tasks/[taskId])
  if (path.startsWith(AppRoutes.TaskDetails)) {
    return m.header_task_details();
  }

  // Check for teacher contest task user stats (e.g., /dashboard/teacher/contests/[contestId]/tasks/[taskId]/user-stats)
  if (path.match(/^\/dashboard\/teacher\/contests\/\d+\/tasks\/\d+\/user-stats/)) {
    return m.task_user_stats_title();
  }

  // Check for teacher contest user stats (e.g., /dashboard/teacher/contests/[contestId]/user-stats)
  if (path.match(/^\/dashboard\/teacher\/contests\/\d+\/user-stats/)) {
    return m.contest_user_stats_title();
  }

  // Check for admin contest registration requests (e.g., /dashboard/admin/contests/[contestId]/registration-requests)
  if (path.match(/^\/dashboard\/admin\/contests\/\d+\/registration-requests/)) {
    return m.admin_registration_requests_title();
  }

  // Check for teacher groups detail pages (e.g., /dashboard/teacher/groups/[groupId])
  if (path.match(/^\/dashboard\/teacher\/groups\/\d+/)) {
    return m.groups_management_title();
  }

  // Check for contest groups pages (e.g., /dashboard/teacher/contests/[contestId]/groups)
  if (path.match(/^\/dashboard\/teacher\/contests\/\d+\/groups/)) {
    return m.contest_groups_title();
  }

  // Return the translation for the route, or default to main dashboard title
  return routeTitleMap[path]?.() ?? m.header_dashboard();
}
