import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { i18n } from '$lib/i18n';
import { env } from '$env/dynamic/private';
import { PARSE_ERROR, SESSION_COOKIE_NAME, parse_error_response } from '$lib/server/utils';
import type { PageServerLoad } from './$types';
import { message, superValidate, type ErrorStatus } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createGroupSchema } from '$components/groups/formschema';
import type { ApiErrorResponse } from '$lib/backendSchemas';
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		localUser: locals.user!,
		createGroupForm: await superValidate(zod(createGroupSchema))
	};
};

export const actions: Actions = {
	logout: async ({ locals, cookies, fetch }) => {
		const response = await fetch(`${env.BACKEND_URL}/api/v1/session/invalidate`, {
			method: 'POST',
			headers: {
				session: `${locals.sessionId}`
			}
		});

		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

		if (!response.ok) {
			const errorResponse: ApiErrorResponse = await parse_error_response(response);
			error(response.status, {
				code: errorResponse.data.code,
				message: errorResponse.data.message
			});
		}

		redirect(302, i18n.resolveRoute('/auth'));
	},

	createGroup: async (event, { fetch } = event) => {
		const form = await superValidate(event, zod(createGroupSchema));
		if (!form.valid) {
			return {
				createGroupForm: form
			};
		}

		try {
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
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
			return message(form, '');
		} catch (e) {
			return fail(500, {
				form
			});
		}
	}
};
