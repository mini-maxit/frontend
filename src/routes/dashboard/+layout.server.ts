import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { i18n } from '$lib/i18n.js';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, i18n.resolveRoute('/dashboard/login'));
	}
	return { user: event.locals.user };
};
