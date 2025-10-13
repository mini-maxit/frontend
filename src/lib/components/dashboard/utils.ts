import { AppRoutes } from '$lib/routes';
import { delocalizePath } from '$lib/routes';
import { m } from '$lib/paraglide/messages.js';

export function getDashboardTitleTranslationFromPathname(pathname: string): string {
  const path = delocalizePath(pathname);

  // Map dashboard routes to their translation keys
  const routeTitleMap: Record<string, () => string> = {
    [AppRoutes.Dashboard]: () => m.header_dashboard(),
    [AppRoutes.UserGroups]: () => m.sidebar_your_groups(),
    [AppRoutes.UserSubmissions]: () => m.sidebar_your_submissions(),
    [AppRoutes.UserContests]: () => m.sidebar_your_contests(),
    [AppRoutes.UserTasks]: () => m.sidebar_your_tasks(),
    [AppRoutes.UserProfile]: () => m.sidebar_profile(),
    [AppRoutes.AvailableContests]: () => m.sidebar_available_contests(),
    [AppRoutes.AvailableTasks]: () => m.sidebar_available_tasks()
  };

  // Return the translation for the route, or default to main dashboard title
  return routeTitleMap[path]?.() ?? m.header_dashboard();
}
