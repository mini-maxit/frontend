import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { type GetAllTasksResponse } from '$lib/backendSchemas';
import { error } from '@sveltejs/kit';
import type { ApiErrorResponse } from '$lib/backendSchemas';
import { parse_error_response } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/task/`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!response.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(response);
		error(response.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const { data }: GetAllTasksResponse = await response.json();

	return {
		tasks: data
	};
};
