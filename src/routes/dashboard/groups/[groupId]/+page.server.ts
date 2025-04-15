import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as m from '$lib/paraglide/messages.js';
import { env } from '$env/dynamic/private';
import { parse_error_response } from '$lib/server/utils';
import type {
	ApiErrorResponse,
	GetAllTasksResponse,
	GetAllUsersResponse,
	GetGroupResponse
} from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { groupId } = params;

	let groupIdInt: number;
	try {
		groupIdInt = parseInt(groupId);
	} catch (e) {
		error(400, { message: m.error_invalid_group_id_error_message() });
	}

	const groupResponse = await fetch(`${env.BACKEND_URL}/api/v1/group/${groupIdInt}`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!groupResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(groupResponse);
		error(groupResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}
	const group: GetGroupResponse = await groupResponse.json();

	return {
		group: group.data
	};
};
