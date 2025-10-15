import { deLocalizeUrl } from '$lib/paraglide/runtime';

export enum AppRoutes {
  Home = '/',
  Login = '/login',
  Register = '/register',

  Hero = '/#hero',
  Features = '/#features',
  HowItWorks = '/#howitworks',
  CTA = '/#cta',

  Dashboard = '/dashboard',
  UserGroups = '/dashboard/user/groups',
  UserSubmissions = '/dashboard/user/submissions',
  UserContests = '/dashboard/user/contests',
  UserTasks = '/dashboard/user/tasks',
  UserProfile = '/dashboard/user/profile',
  AvailableContests = '/dashboard/contests',
  AvailableTasks = '/dashboard/tasks',

  Admin = '/dashboard/admin',
  AdminContests = '/dashboard/admin/contests',
  AdminGroups = '/dashboard/admin/groups',
  AdminTasks = '/dashboard/admin/tasks',

  Error = '/error'
}

/**
 * Delocalizes a pathname by removing locale prefixes
 */
export function delocalizePath(pathname: string): string {
  return deLocalizeUrl(pathname).pathname;
}

export function isProtectedRoute(pathname: string): boolean {
  const delocalized = delocalizePath(pathname);
  return delocalized.startsWith(AppRoutes.Dashboard);
}

export function isPublicRoute(pathname: string): boolean {
  const delocalized = delocalizePath(pathname);
  const publicRoutes = [AppRoutes.Home, AppRoutes.Login, AppRoutes.Register];

  return publicRoutes.some((route) => delocalized === route || delocalized.startsWith(route));
}
