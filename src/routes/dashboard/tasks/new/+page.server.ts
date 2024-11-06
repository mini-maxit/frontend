import type { PageServerLoad } from './$types.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { uploadTaskSchema } from '$lib/components/tasks/formSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';
import { i18n } from '$lib/i18n.js';
import { FILESTORAGE_URL } from '$env/static/private';
import { db } from '$lib/server/db/index.js';
import { tasks } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(uploadTaskSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(uploadTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { id, name, archive } = form.data;

		try {
			const formData = new FormData();
			formData.append('taskID', id.toString());
			formData.append('overwrite', 'false');
			formData.append('archive', archive);

			const response = await fetch(`${FILESTORAGE_URL}/createTask`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				return message(form, "Failed to create task", { status: response.status as 400 | 401 | 500 | 503 });
			}

			await db.insert(tasks).values({
				id,
				name,
				createdById: event.locals.user!.id
			});
			
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create task'
			});
		}

		redirect(303, i18n.resolveRoute(`/dashboard/tasks/${id}`));
	}
};
