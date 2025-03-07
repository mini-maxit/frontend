import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { SESSION_COOKIE_NAME } from '$lib/server/utils';
import { env } from '$env/dynamic/private';
import type { AuthSessionResponse } from '$lib/backendSchemas';
const handleParaglide: Handle = i18n.handle();

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) {
		return resolve(event);
	}

	const response = await fetch(`${env.BACKEND_URL}/api/v1/session/validate`, {
		headers: {
			session: `${sessionId}`
		}
	});

	if (!response.ok) {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return resolve(event);
	}

	const responseJson: AuthSessionResponse = await response.json();
	event.locals.user = responseJson.data.user;
	event.locals.sessionId = sessionId;

	return resolve(event);
};

const protectDashboard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (path.startsWith(i18n.resolveRoute('/dashboard'))) {
		if (!event.locals.user || !event.locals.sessionId) {
			redirect(303, i18n.resolveRoute('/auth'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, protectDashboard);
