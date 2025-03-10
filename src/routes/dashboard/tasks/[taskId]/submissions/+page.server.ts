import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import type { GetAllSubmissionsResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
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
		error(submissionDataResponse.status, 'Failed to fetch submission data');
	}

	const submissionData: GetAllSubmissionsResponse = await submissionDataResponse.json();
	return { submissions: submissionData.data };
};
