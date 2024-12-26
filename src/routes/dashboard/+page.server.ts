import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { i18n } from '$lib/i18n';
import { env } from '$env/dynamic/private';
import { sessionCookieName } from '$lib';

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const response = await fetch(`${env.BACKEND_URL}/api/v1/session/invalidate`, {
			headers: {
				session: `${event.locals.session.id}`
			}
		});

		if (!response.ok) {
			console.log('Failed to invalidate session');
		}

		event.cookies.delete(sessionCookieName, { path: '/' });

		return redirect(302, i18n.resolveRoute('/dashboard/login'));
	}
};
