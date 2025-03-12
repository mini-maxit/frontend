import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import * as m from '$lib/paraglide/messages';
import { parse_error_response } from '$lib/server/utils';
import { env } from '$env/dynamic/private';
import type { ApiErrorResponse, GetTaskResponse } from '$lib/backendSchemas';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { taskId } = params;
	let taskIdInt: number;

	try {
		taskIdInt = parseInt(taskId);
	} catch (e) {
		error(400, {
			message: m.error_invalid_task_id_error_message()
		});
	}

	const taskDataResponse = await fetch(`${env.BACKEND_URL}/api/v1/task/${taskIdInt}`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!taskDataResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(taskDataResponse);
		error(taskDataResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const task: GetTaskResponse = await taskDataResponse.json();

	return {
		task: task.data
	};
};
