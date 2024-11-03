import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { uploadTaskSchema } from '$lib/components/tasks/formSchema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';
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

		let taskId = null;

		try {
			// todo: fire to filestorage to insert the task zip file
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to create task'
			});
		}

		redirect(303, i18n.resolveRoute(`/dashboard/tasks/${taskId}`));
	}
};
