import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import { message, superValidate } from 'sveltekit-superforms';
import { registerSchema } from '$lib/components/auth/schemas';
import { loginSchema } from '$lib/components/auth/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { env } from '$env/dynamic/private';
import { sessionCookieName } from '$lib';
import type { AuthUserResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async () => {
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

		const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});

		//todo: handle errors more explicitly

		if (!response.ok) {
			return fail(response.status, { message: 'Invalid credentials' });
		}

		const responseJson: AuthUserResponse = await response.json();

		event.cookies.set(sessionCookieName, responseJson.data.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: new Date(responseJson.data.expires_at),
			secure: !dev
		});

		return redirect(302, i18n.resolveRoute('/dashboard'));
	},
	register: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});

		// todo: handle errors more explicitly

		if (!response.ok) {
			return message(form, { message: 'An error has occurred' });
		}

		const responseJson: AuthUserResponse = await response.json();

		event.cookies.set(sessionCookieName, responseJson.data.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: new Date(responseJson.data.expires_at),
			secure: !dev
		});

		return redirect(302, i18n.resolveRoute('/dashboard'));
	}
};
