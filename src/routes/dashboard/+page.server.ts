import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { i18n } from '$lib/i18n';

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		event.cookies.delete(auth.sessionCookieName, { path: '/' });

		return redirect(302, i18n.resolveRoute('/dashboard/login'));
	}
};
