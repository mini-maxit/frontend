import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { createTaskSchema } from '$components/tasks/formSchemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import { i18n } from '$lib/i18n.js';
import { env } from '$env/dynamic/private';
import type { UploadTaskResponse } from '$lib/backendSchemas.js';
import type { ApiErrorResponse } from '$lib/backendSchemas.js';
import { parse_error_response } from '$lib/server/utils.js';
import { PARSE_ERROR } from '$lib/server/utils.js';
import { message } from 'sveltekit-superforms';
import type { ErrorStatus } from 'sveltekit-superforms';
import * as m from '$lib/paraglide/messages.js';
import { error } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		form: await superValidate(zod(createTaskSchema)),
		userId: locals.user!.id
	};
};

export const actions: Actions = {
	createTask: async (event, { fetch } = event) => {
		const form = await superValidate(event, zod(createTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { title, archive } = form.data;

		const formData = new FormData();
		formData.append('title', title);
		formData.append('archive', archive);

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/`, {
				method: 'POST',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
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

			const responseJson: UploadTaskResponse = await response.json();
			redirect(303, i18n.resolveRoute(`/dashboard/tasks/${responseJson.data.id}`));
		} catch (e) {
			if (isRedirect(e)) throw e;
			toast.error(m.error_unexpected_request_error_message());
			return fail(500, {
				form
			});
		}
	}
};
