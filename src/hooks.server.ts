import type { Handle } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '#lib/paraglide/server.js';

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    // kit 3 made event.request readonly. Replace it in place (instead of passing a
    // cloned event) so object identity with the request store (getRequestEvent())
    // is preserved — a shallow clone desyncs the two.
    Object.defineProperty(event, 'request', { value: request, configurable: true });

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    });
  });

export const handle: Handle = handleParaglide;
