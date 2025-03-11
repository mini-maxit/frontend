import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import {
	UserRole,
	type ApiErrorResponse,
	type GetAllSubmissionsResponse
} from '$lib/backendSchemas';
import { parse_error_response } from '$lib/server/utils';
import * as m from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ parent, params, locals }) => {
	const { task } = await parent();
	const user = locals.user!;
	if (
		(user.role !== UserRole.Teacher || task.created_by !== user.id) &&
		user.role !== UserRole.Admin
	) {
		error(403, {
			message: m.error_not_allowed_to_view_page_error_message()
		});
	}
	const { taskId } = params;
	let taskIdInt: number;

	try {
		taskIdInt = parseInt(taskId);
	} catch (e) {
		error(400, { message: 'Invalid task id' });
	}
	const submissionUrl = `${env.BACKEND_URL}/api/v1/submission/task/${taskIdInt}`;
	const submissionDataResponse = await fetch(submissionUrl, {
		headers: { session: `${locals.sessionId}` }
	});

	if (!submissionDataResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(submissionDataResponse);
		error(submissionDataResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const submissionData: GetAllSubmissionsResponse = await submissionDataResponse.json();
	return { submissions: submissionData.data };
};
