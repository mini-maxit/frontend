import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session) {
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev
		});
	} else {
		event.cookies.delete(auth.sessionCookieName, { path: '/' });
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const protectDashboard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const isProtectedPath =
		path.startsWith('/dashboard/') && path !== i18n.resolveRoute('/dashboard/login');

	if (isProtectedPath) {
		if (!event.locals.user) {
			throw redirect(303, i18n.resolveRoute('/dashboard/login'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, protectDashboard);
