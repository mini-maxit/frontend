import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { GetSubmissionResponse, GetUserResponse, UserData } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || !locals.sessionId) {
		return error(401, 'Unauthorized');
	}
	const { userId } = params;
	let userIdInt: number;

	try {
		userIdInt = parseInt(userId);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	const { userData, submissionData } = await fetchUserAndSubmissionData(
		locals.user,
		userIdInt,
		locals.sessionId
	);

	return {
		user: userData,
		submissions: submissionData
	};
};

const fetchUserAndSubmissionData = async (
	eventUserData: UserData,
	userIdInt: number,
	sessionId: string
) => {
	try {
		const userUrl = `${env.BACKEND_URL}/api/v1/user/${userIdInt}`;
		const submissionUrl = `${env.BACKEND_URL}/api/v1/submission/user/${userIdInt}`;

		const userDataRequest = fetch(userUrl, {
			headers: { session: `${sessionId}` }
		});
		const submissionDataRequest = fetch(submissionUrl, {
			headers: { session: `${sessionId}` }
		});

		if (userIdInt == eventUserData.id) {
			const submissionDataResponse = await submissionDataRequest;
			if (!submissionDataResponse.ok) {
				throw new Error('Failed to fetch submission data');
			}
			const submissionData: GetSubmissionResponse = await submissionDataResponse.json();
			return { userData: eventUserData, submissionData: submissionData.data };
		}

		let userData: GetUserResponse | null = null;
		let submissionData: GetSubmissionResponse | null = null;

		if (eventUserData.role === 'admin') {
			const [userDataResponse, submissionDataResponse] = await Promise.all([
				userDataRequest,
				submissionDataRequest
			]);

			if (!userDataResponse.ok || !submissionDataResponse.ok) {
				throw new Error('Failed to fetch user or submission data');
			}

			userData = await userDataResponse.json();
			submissionData = await submissionDataResponse.json();
		} else {
			const userDataResponse = await userDataRequest;

			if (!userDataResponse.ok) {
				throw new Error('Failed to fetch user data');
			}

			userData = await userDataResponse.json();
		}

		return { userData: userData!.data, submissionData: submissionData?.data || [] };
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};
