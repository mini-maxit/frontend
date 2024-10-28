import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { i18n } from '$lib/i18n.js';

export const load: LayoutServerLoad = async (event) => {
	const dashboardLogin = i18n.resolveRoute('/dashboard/login');
	if (!event.locals.user && event.url.pathname !== dashboardLogin) {
		return redirect(302, dashboardLogin);
	}
	return { user: event.locals.user };
};
