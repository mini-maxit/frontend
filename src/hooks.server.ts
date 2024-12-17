import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { sessionCookieName } from '$lib';
import { env } from '$env/dynamic/private';
const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(sessionCookieName);
	if (!sessionId) {
		event.locals.userId = null;
		event.locals.session = null;
		return resolve(event);
	}

	const response = await fetch(`${env.BACKEND_URL}/api/v1/session/validate`, {
		headers: {
			session: `${sessionId}`
		}
	});

	if (!response.ok) {
		event.locals.userId = null;
		event.locals.session = null;
		event.cookies.delete(sessionCookieName, { path: '/' });
		return resolve(event);
	}

	const responseJson = await response.json();
	event.locals.userId = responseJson.data.user_id;
	event.locals.session = responseJson.data;

	return resolve(event);
};

const protectDashboard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const isProtectedPath =
		path.startsWith('/dashboard/') && path !== i18n.resolveRoute('/dashboard/login');

	if (isProtectedPath) {
		if (!event.locals.userId) {
			throw redirect(303, i18n.resolveRoute('/dashboard/login'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, protectDashboard);
