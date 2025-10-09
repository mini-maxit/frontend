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
