import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$lib/components/tasks/solutions/formSchema';
import type { GetAvailableLanguagesResponse, GetTaskResponse } from '$lib/backendSchemas';

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
	console.log(
		`${env.FILESTORAGE_URL}/getTaskDescription?` +
			new URLSearchParams({ taskID: taskIdInt.toString() }).toString()
	);

	const taskDescriptionResponse = await fetch(
		`${env.FILESTORAGE_URL}/getTaskDescription?` +
			new URLSearchParams({ taskID: taskIdInt.toString() }).toString()
	);

	if (!taskDescriptionResponse.ok) {
		throw error(500, 'Failed to fetch task description');
	}

	console.log('task', taskDescriptionResponse);

	const availableLanguagesResponse = await fetch(`${env.BACKEND_URL}/api/v1/submission/languages`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!availableLanguagesResponse.ok) {
		throw error(500, 'Failed to fetch available languages');
	}

	const availableLanguages: GetAvailableLanguagesResponse = await availableLanguagesResponse.json();

	return {
		task: {
			name: task.data.title,
			id: task.data.id,
			description: taskDescriptionResponse.arrayBuffer()
		},
		uploadSolutionForm: await superValidate(zod(uploadTaskSolutionSchema)),
		availableLanguages: availableLanguages.data
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

		const { id, file, languageId } = form.data;

		try {
			const formData = new FormData();
			formData.append('taskID', id.toString());
			formData.append('solution', file);
			// #TODO add language selection to form
			formData.append('languageID', languageId.toString());

			const response = await fetch(`${env.BACKEND_URL}/api/v1/submission/submit`, {
				method: 'POST',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				return fail(500, {
					form,
					error: 'Failed to submit solution' + response.statusText
				});
			}

			return {
				status: 200,
				body: {
					success: true
				}
			};
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to submit solution' + error
			});
		}
	}
};
