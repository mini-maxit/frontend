import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { createTaskSchema } from '$lib/components/tasks/formSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import { i18n } from '$lib/i18n.js';
import { env } from '$env/dynamic/private';
import type { UploadTaskResponse } from '$lib/backendSchemas.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { userId } = await parent();
	return {
		form: await superValidate(zod(createTaskSchema)),
		userId
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { userId, name, archive } = form.data;

		try {
			const formData = new FormData();
			formData.append('userId', userId.toString());
			formData.append('taskName', name);
			formData.append('overwrite', 'false');
			formData.append('archive', archive);
			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/`, {
				method: 'POST',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});
			if (!response.ok) {
				return fail(500, {
					form,
					error: 'Failed to create task'
				});
			}

			const responseJson: UploadTaskResponse = await response.json();

			return redirect(303, i18n.resolveRoute(`/dashboard/tasks/${responseJson.data.id}`));
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			}
			return fail(500, {
				form,
				error: 'Failed to create task'
			});
		}
	}
};
