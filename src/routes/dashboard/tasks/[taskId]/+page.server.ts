import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$components/tasks/solutions/formSchema';
import type { GetAvailableLanguagesResponse, GetTaskResponse, TaskData } from '$lib/backendSchemas';
import { editTaskSchema } from '$components/tasks/formSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || !locals.sessionId) {
		return redirect(303, '/dashboard/login');
	}
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

	const availableLanguagesResponse = await fetch(`${env.BACKEND_URL}/api/v1/submission/languages`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!availableLanguagesResponse.ok) {
		throw error(500, 'Failed to fetch available languages');
	}

	const availableLanguages: GetAvailableLanguagesResponse = await availableLanguagesResponse.json();

	const taskData: Omit<TaskData, 'description_url'> & {
		description_file: Promise<ArrayBuffer>;
	} = {
		id: task.data.id,
		title: task.data.title,
		created_by: task.data.created_by,
		description_file: taskDescriptionResponse.arrayBuffer()
	};

	return {
		task: taskData,
		localUser: locals.user,
		uploadSolutionForm: await superValidate(zod(uploadTaskSolutionSchema)),
		editTaskForm: await superValidate(zod(editTaskSchema)),
		availableLanguages: availableLanguages.data
	};
};

export const actions: Actions = {
	uploadSolution: async (event) => {
		if (!event.locals.user || !event.locals.sessionId) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}
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

			return redirect(303, `/dashboard/tasks/${id}`);
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to submit solution' + error
			});
		}
	},

	editTask: async (event) => {
		if (!event.locals.user || !event.locals.sessionId) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const form = await superValidate(event, zod(editTaskSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.log(form.data);

		const { id, userId, title, archive } = form.data;

		try {
			const formData = new FormData();
			formData.append('id', id.toString());
			formData.append('userId', userId.toString());
			formData.append('title', title);
			formData.append('overwrite', 'true');
			formData.append('archive', archive);

			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/${id}`, {
				method: 'PATCH',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			console.log(await response.json());

			if (!response.ok) {
				return fail(500, {
					form,
					error: 'Failed to update task'
				});
			}
		} catch (error) {
			return fail(500, {
				form,
				error: 'Failed to update task'
			});
		}
	}
};
