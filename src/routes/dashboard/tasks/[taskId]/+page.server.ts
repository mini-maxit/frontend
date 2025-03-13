import { error, isRedirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import * as m from '$lib/paraglide/messages.js';
import { uploadTaskSolutionSchema } from '$components/tasks/solutions/formSchema';
import type {
	GetAllGroupsResponse,
	GetAvailableLanguagesResponse,
	GetTaskResponse,
	TaskData
} from '$lib/backendSchemas';
import { assignTaskToGroupsSchema, editTaskSchema } from '$components/tasks/formSchemas';
import type { ApiErrorResponse } from '$lib/backendSchemas';
import { PARSE_ERROR, parse_error_response } from '$lib/server/utils';
import { message } from 'sveltekit-superforms';
import type { ErrorStatus } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { task } = await parent();
	const taskDescriptionResponse = await fetch(
		`${env.FILESTORAGE_URL}/getTaskDescription?` +
			new URLSearchParams({ taskID: task.id.toString() }).toString()
	);

	if (!taskDescriptionResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(taskDescriptionResponse);
		error(taskDescriptionResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const availableLanguagesResponse = await fetch(`${env.BACKEND_URL}/api/v1/submission/languages`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	const userGroupsResponse = await fetch(`${env.BACKEND_URL}/api/v1/group/`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!availableLanguagesResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(availableLanguagesResponse);
		error(availableLanguagesResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const availableLanguages: GetAvailableLanguagesResponse = await availableLanguagesResponse.json();
	const userGroups: GetAllGroupsResponse = await userGroupsResponse.json();

	const taskData: Omit<TaskData, 'description_url'> & {
		description_file: Promise<ArrayBuffer>;
	} = {
		id: task.id,
		title: task.title,
		created_by: task.created_by,
		description_file: taskDescriptionResponse.arrayBuffer()
	};

	return {
		task: taskData,
		localUser: locals.user!,
		uploadSolutionForm: await superValidate(zod(uploadTaskSolutionSchema)),
		editTaskForm: await superValidate(zod(editTaskSchema)),
		assingTaskToGroupsForm: await superValidate(zod(assignTaskToGroupsSchema)),
		availableLanguages: availableLanguages.data,
		userGroups: userGroups.data
	};
};

export const actions: Actions = {
	uploadSolution: async (event) => {
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
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
			return message(form, '');
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(500, {
				form
			});
		}
	},

	editTask: async (event) => {
		const form = await superValidate(event, zod(editTaskSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { id, title, archive } = form.data;

		try {
			const formData = new FormData();
			formData.append('id', id.toString());
			formData.append('title', title);
			if (archive) {
				formData.append('archive', archive);
			}

			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/${id}`, {
				method: 'PATCH',
				body: formData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== 'PARSE_ERROR') {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
		} catch (e) {
			return fail(500, {
				form
			});
		}
	},

	assignGroups: async (event) => {
		const form = await superValidate(event, zod(assignTaskToGroupsSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { taskId, groupIds } = form.data;

		try {
			const jsonData = JSON.stringify({
				groupIds: groupIds.map((id) => parseInt(id))
			});

			const response = await fetch(`${env.BACKEND_URL}/api/v1/task/${taskId}/assign/groups`, {
				method: 'POST',
				body: jsonData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				const errorReponse: ApiErrorResponse = await parse_error_response(response);
				if (errorReponse.data.code !== 'PARSE_ERROR') {
					return message(form, errorReponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
			}
			return { form };
		} catch (e) {
			return fail(500, {
				form,
				error: 'Failed to assign task to groups'
			});
		}
	}
};
