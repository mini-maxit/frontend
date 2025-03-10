import { env } from '$env/dynamic/private';
import type { GetAllGroupsResponse } from '$lib/backendSchemas';
import { parse_error_response } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ApiErrorResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/group/`, {
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

	const { data }: GetAllGroupsResponse = await response.json();

	return {
		groups: data
	};
};
