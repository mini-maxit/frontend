import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { type ApiErrorResponse, type GetAllUsersResponse } from '$lib/backendSchemas';
import { error } from '@sveltejs/kit';
import { parse_error_response } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/user/`, {
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

	const { data }: GetAllUsersResponse = await response.json();

	return {
		users: data
	};
};
