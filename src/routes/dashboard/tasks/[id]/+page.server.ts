import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL, FILESTORAGE_URL } from '$env/static/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$lib/components/tasks/solutions/formSchema';
import type { GetTaskResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	let idInt: number;

	try {
		idInt = parseInt(id);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	const taskDataResponse = await fetch(`${BACKEND_URL}/tasks/${idInt}`);

	if (!taskDataResponse.ok) {
		throw error(500, 'Failed to fetch task data');
	}

	const task: GetTaskResponse = await taskDataResponse.json();

	const taskDescriptionResponse = await fetch(
		`${FILESTORAGE_URL}/getTaskDescription?taskID=${idInt}`
	);

	if (!taskDescriptionResponse.ok) {
		throw error(500, 'Failed to fetch task description');
	}

	return {
		task: {
			name: task.data.title,
			id: task.data.id,
			description: await taskDescriptionResponse.arrayBuffer()
		},
		uploadSolutionForm: await superValidate(zod(uploadTaskSolutionSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(uploadTaskSolutionSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		// todo: implement solution upload
	}
};
