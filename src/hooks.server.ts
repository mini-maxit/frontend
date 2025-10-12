import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes, isProtectedRoute } from '$lib/routes';
import { ACCESS_TOKEN_KEY } from '$lib/token';
import { decodeAccessToken } from '$lib/jwt';

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    });
  });

const handleAuth: Handle = async ({ event, resolve }) => {
  event.locals.user = null;

  const accessToken = event.cookies.get(ACCESS_TOKEN_KEY);
  if (accessToken) {
    const user = decodeAccessToken(accessToken);
    if (user) {
      event.locals.user = user;
    }
  }

  if (isProtectedRoute(event.url.pathname)) {
    if (!event.locals.user) {
      // Store the original URL to redirect back after login
      const redirectTo = event.url.pathname + event.url.search;

      // Localize the login URL with the redirectTo parameter
      const loginUrl = new URL(AppRoutes.Login, event.url.origin);
      loginUrl.searchParams.set('redirectTo', redirectTo);
      const localizedLoginUrl = localizeUrl(loginUrl);

      redirect(307, localizedLoginUrl.pathname + localizedLoginUrl.search);
    }
  }

  return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
