import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import { message, superValidate, type ErrorStatus } from 'sveltekit-superforms';
import { registerSchema } from '$components/auth/formSchemas';
import { loginSchema } from '$components/auth/formSchemas';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from '$lib/paraglide/messages.js';
import { env } from '$env/dynamic/private';
import { PARSE_ERROR, SESSION_COOKIE_NAME, parse_error_response } from '$lib/server/utils';
import type { ApiErrorResponse, AuthUserResponse } from '$lib/backendSchemas';
import { toast } from 'svelte-sonner';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user && locals.sessionId) {
		redirect(302, i18n.resolveRoute('/dashboard'));
	}

	return {
		registerForm: await superValidate(zod(registerSchema)),
		loginForm: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				form.data.email = '';
				form.data.password = '';
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
			}

			const responseJson: AuthUserResponse = await response.json();

			event.cookies.set(SESSION_COOKIE_NAME, responseJson.data.session, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: new Date(responseJson.data.expires_at),
				secure: !dev
			});
			redirect(303, i18n.resolveRoute('/dashboard'));
		} catch (e) {
			if (isRedirect(e)) throw e;
			toast.error(m.error_unexpected_request_error_message());
			return fail(500, {
				form
			});
		}
	},
	register: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				const errorReponse: ApiErrorResponse = await parse_error_response(response);
				if (errorReponse.data.code !== PARSE_ERROR) {
					return message(form, errorReponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
			}

			const responseJson: AuthUserResponse = await response.json();

			event.cookies.set(SESSION_COOKIE_NAME, responseJson.data.session, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: new Date(responseJson.data.expires_at),
				secure: !dev
			});
		} catch (e) {
			toast.error(m.error_unexpected_request_error_message());
			return fail(500, {
				form
			});
		}
		redirect(303, i18n.resolveRoute('/dashboard'));
	}
};
