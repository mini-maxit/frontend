import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$lib/components/tasks/solutions/formSchema';
import type { GetTaskResponse } from '$lib/backendSchemas';
import { editTaskSchema } from '$lib/components/tasks/formSchema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { taskId } = params;
	let taskIdInt: number;

	try {
		taskIdInt = parseInt(taskId);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	const taskDataResponse = await fetch(`${env.BACKEND_URL}/api/v1/task/${taskIdInt}`, {
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
			new URLSearchParams({ taskID: taskIdInt.toString() }).toString()
	);

	if (!taskDescriptionResponse.ok) {
		throw error(500, 'Failed to fetch task description');
	}

	const availavleLanguagesResponse = await fetch(`${env.BACKEND_URL}/api/v1/submission/languages`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!availavleLanguagesResponse.ok) {
		throw error(500, 'Failed to fetch available languages');
	}

	return {
		task: {
			name: task.data.title,
			id: task.data.id,
			description: taskDescriptionResponse.arrayBuffer()
		},
		editTaskForm: await superValidate(zod(editTaskSchema)),
		availableLanguages: (await availavleLanguagesResponse.json()).data
	};
};
