import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { sessionCookieName } from '$lib';
import { env } from '$env/dynamic/private';
import type { AuthSessionResponse } from '$lib/backendSchemas';
const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(sessionCookieName);
	console.log(sessionId);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.sessionId = null;
		return resolve(event);
	}

	const response = await fetch(`${env.BACKEND_URL}/api/v1/session/validate`, {
		headers: {
			session: `${sessionId}`
		}
	});

	if (!response.ok) {
		event.locals.user = null;
		event.locals.sessionId = null;
		event.cookies.delete(sessionCookieName, { path: '/' });
		return resolve(event);
	}

	const responseJson: AuthSessionResponse = await response.json();
	event.locals.user = responseJson.data.user;
	event.locals.sessionId = sessionId;

	return resolve(event);
};

const protectDashboard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const isProtectedPath =
		path.startsWith('/dashboard/') && path !== i18n.resolveRoute('/dashboard/login');

	if (isProtectedPath) {
		if (!event.locals.user) {
			return redirect(303, i18n.resolveRoute('/dashboard/login'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, protectDashboard);
