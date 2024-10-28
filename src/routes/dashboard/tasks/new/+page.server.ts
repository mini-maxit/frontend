import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { uploadTaskSchema } from '$lib/components/tasks/formSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';
import { parseFormToTask } from '$lib/components/tasks';
import { insertTask } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { i18n } from '$lib/i18n.js';

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

		try {
			const task = await parseFormToTask(form);

			const taskId = await insertTask(db, event.locals.user!.id, task);

			throw redirect(303, i18n.resolveRoute(`/dashboard/tasks/${taskId}`));
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create task'
			});
		}
	}
};
