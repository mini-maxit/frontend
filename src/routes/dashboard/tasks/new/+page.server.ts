import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { createTaskSchema } from '$components/tasks/formSchemas.js';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';
import { i18n } from '$lib/i18n.js';
import { env } from '$env/dynamic/private';
import type { UploadTaskResponse } from '$lib/backendSchemas.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(303, i18n.resolveRoute('/dashboard/login'));
	}
	return {
		form: await superValidate(zod(createTaskSchema)),
		userId: locals.user.id
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user || !event.locals.sessionId) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}
		const form = await superValidate(event, zod(createTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { userId, title, archive } = form.data;
		let taskId: number;

		try {
			const formData = new FormData();
			formData.append('userId', userId.toString());
			formData.append('title', title);
			formData.append('overwrite', 'false');
			formData.append('archive', archive);
			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/`, {
				method: 'POST',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			console.log(await response.json());

			if (!response.ok) {
				return fail(500, {
					form,
					error: 'Failed to create task'
				});
			}

			const responseJson: UploadTaskResponse = await response.json();
			taskId = responseJson.data.id;
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create task'
			});
		}
		return redirect(303, i18n.resolveRoute(`/dashboard/tasks/${taskId}`));
	}
};
