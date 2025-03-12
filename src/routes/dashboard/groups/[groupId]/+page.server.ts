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

	const groupTasksRequest = fetch(`${env.BACKEND_URL}/api/v1/group/${groupIdInt}/tasks`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	const groupUsersRequest = fetch(`${env.BACKEND_URL}/api/v1/group/${groupIdInt}/users`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	const groupRequest = await fetch(`${env.BACKEND_URL}/api/v1/group/${groupIdInt}`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	const [groupTasksResponse, groupUsersResponse, groupResponse] = await Promise.all([
		groupTasksRequest,
		groupUsersRequest,
		groupRequest
	]);

	if (!groupUsersResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(groupUsersResponse);
		error(groupUsersResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	if (!groupTasksResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(groupTasksResponse);
		error(groupTasksResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	if (!groupResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(groupResponse);
		error(groupResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const groupUsers: GetAllUsersResponse = await groupUsersResponse.json();
	const groupTasks: GetAllTasksResponse = await groupTasksResponse.json();
	const group: GetGroupResponse = await groupResponse.json();

	console.log(groupUsers, groupTasks.data[0]);

	return {
		group: group.data,
		groupUsers: groupUsers.data,
		groupTasks: groupTasks.data
	};
};
