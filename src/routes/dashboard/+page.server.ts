import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { i18n } from '$lib/i18n';
import { env } from '$env/dynamic/private';
import { sessionCookieName } from '$lib';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createGroupSchema } from '$components/groups/formschema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.sessionId) {
		return redirect(302, i18n.resolveRoute('/dashboard/login'));
	}

	return {
		localUser: locals.user,
		createGroupForm: await superValidate(zod(createGroupSchema))
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.sessionId) {
			return fail(401);
		}
		const response = await fetch(`${env.BACKEND_URL}/api/v1/session/invalidate`, {
			method: 'POST',
			headers: {
				session: `${event.locals.sessionId}`
			}
		});

		if (!response.ok) {
			// todo: how to handle this?
			console.log('Failed to invalidate session');
		}

		event.cookies.delete(sessionCookieName, { path: '/' });

		return redirect(302, i18n.resolveRoute('/dashboard/login'));
	},

	createGroup: async (event) => {
		if (!event.locals.user || !event.locals.sessionId) {
			return fail(401);
		}
		const form = await superValidate(event, zod(createGroupSchema));
		if (!form.valid) {
			return {
				createGroupForm: form
			};
		}

		const response = await fetch(`${env.BACKEND_URL}/api/v1/group/`, {
			method: 'POST',
			headers: {
				session: `${event.locals.sessionId}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: form.data.name
			})
		});

		if (!response.ok) {
			return fail(500, {
				form,
				error: 'Failed to update user'
			});
		}
		return redirect(303, i18n.resolveRoute('/dashboard/groups'));
	}
};
