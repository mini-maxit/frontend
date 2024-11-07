import { hash, verify } from '@node-rs/argon2';
import { generateRandomString } from '@oslojs/crypto/random';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import { superValidate } from 'sveltekit-superforms';
import { registerSchema } from '$lib/components/auth/schemas';
import { loginSchema } from '$lib/components/auth/schemas';
import { zod } from 'sveltekit-superforms/adapters';

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

		const results = await db
			.select()
			.from(table.users)
			.where(eq(table.users.email, form.data.email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, {
				form,
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await verify(existingUser.passwordHash, form.data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, {
				form,
				message: 'Incorrect username or password'
			});
		}

		const session = await auth.createSession(existingUser.id);
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
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

		const passwordHash = await hash(form.data.password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const _user = await db
				.insert(table.users)
				.values({
					email: form.data.email,
					name: form.data.email,
					surname: form.data.surname,
					username: form.data.username,
					passwordHash
				})
				.returning();
			const user = _user.at(0)!;
			const session = await auth.createSession(user.id);
			event.cookies.set(auth.sessionCookieName, session.id, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: session.expiresAt,
				secure: !dev
			});
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, i18n.resolveRoute('/dashboard'));
	}
};
