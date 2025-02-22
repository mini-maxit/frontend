import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { GetAllSubmissionsResponse, SubmissionData } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || !locals.sessionId) {
		return error(401, 'Unauthorized');
	}
	const { taskId } = params;
	let taskIdInt: number;

	try {
		taskIdInt = parseInt(taskId);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}
	const submissionUrl = `${env.BACKEND_URL}/api/v1/submission/task/${taskIdInt}`;
	const submissionDataResponse = await fetch(submissionUrl, {
		headers: { session: `${locals.sessionId}` }
	});

	if (!submissionDataResponse.ok) {
		return error(submissionDataResponse.status, 'Failed to fetch submission data');
	}

	const submissionData: GetAllSubmissionsResponse = await submissionDataResponse.json();
	return { submissionData: submissionData.data };
};
