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
  UserSubmissions = `${AppRoutes.Dashboard}/user/submissions`,
  UserContests = `${AppRoutes.Dashboard}/user/contests`,
  UserContestTask = `${AppRoutes.Dashboard}/user/contests/`,
  UserTasks = `${AppRoutes.Dashboard}/user/tasks`,
  UserProfile = `${AppRoutes.Dashboard}/user/profile`,
  AvailableContests = `${AppRoutes.Dashboard}/contests`,
  AvailableTasks = `${AppRoutes.Dashboard}/tasks`,
  TaskDetails = `${AppRoutes.Dashboard}/tasks/`,

  Teacher = `${AppRoutes.Dashboard}/teacher`,
  TeacherContests = `${AppRoutes.Teacher}/contests`,
  TeacherContestsRegistrationRequests = `${AppRoutes.Teacher}/contests/`,
  TeacherTasks = `${AppRoutes.Teacher}/tasks`,

  Admin = `${AppRoutes.Dashboard}/admin`,
  AdminUsers = `${AppRoutes.Admin}/users`,

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
