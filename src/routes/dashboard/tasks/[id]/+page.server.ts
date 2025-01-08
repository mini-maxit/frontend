import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$lib/components/tasks/solutions/formSchema';
import type { GetTaskResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	let idInt: number;

	try {
		idInt = parseInt(id);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	const taskDataResponse = await fetch(`${env.BACKEND_URL}/api/v1/task/${idInt}`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!taskDataResponse.ok) {
		throw error(500, 'Failed to fetch task data');
	}

	const task: GetTaskResponse = await taskDataResponse.json();

	const taskDescriptionResponse = await fetch(
		`${env.FILESTORAGE_URL}/getTaskDescription?` +
			new URLSearchParams({ taskID: idInt.toString() }).toString()
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
