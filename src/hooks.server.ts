import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { TokenManager } from '$lib/token';
import { decodeAccessToken } from '$lib/jwt';

const handleAuth: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.includes('/dashboard')) {
    const token = TokenManager.getAccessToken(event.cookies);
    event.locals.user = token ? decodeAccessToken(token) : null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    });
  });

export const handle: Handle = async ({ event, resolve }) => {
  return handleParaglide({
    event,
    resolve: (innerEvent) => handleAuth({ event: innerEvent, resolve })
  });
};
