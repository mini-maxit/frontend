import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, type Actions } from '@sveltejs/kit';
import type { GetAllSubmissionsResponse, GetUserResponse, UserData } from '$lib/backendSchemas';
import { editUserSchema } from '$lib/components/users/formSchemas';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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
		editUserForm: await superValidate(zod(editUserSchema)),
		localUser: locals.user,
		user: userData,
		submissions: submissionData
	};
};

export const actions: Actions = {
	editProfile: async (event) => {
		//TODO: FIX THIS
		const form = await superValidate(event, zod(editUserSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		if (
			!event.locals.user ||
			!event.locals.sessionId ||
			event.locals.user.id !== form.data.userId
		) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}
		const userUrl = `${env.BACKEND_URL}/api/v1/user/${form.data.userId}`;

		const formData = new FormData();
		formData.append('name', form.data.name);
		formData.append('surname', form.data.surname);
		formData.append('username', form.data.username);
		if (form.data.currentPassword) {
			formData.append('currentPassword', form.data.currentPassword);
		}
		if (form.data.newPassword) {
			formData.append('newPassword', form.data.newPassword);
		}
		if (form.data.confirmPassword) {
			formData.append('confirmPassword', form.data.confirmPassword);
		}

		const response = await fetch(userUrl, {
			method: 'PUT',
			body: formData,
			headers: {
				session: `${event.locals.sessionId}`
			}
		});

		if (!response.ok) {
			return fail(500, {
				form,
				error: 'Failed to update user'
			});
		}

		// #TODO handle errors
	}
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
			const submissionData: GetAllSubmissionsResponse = await submissionDataResponse.json();
			return { userData: eventUserData, submissionData: submissionData.data };
		}

		let userData: GetUserResponse | null = null;
		let submissionData: GetAllSubmissionsResponse | null = null;

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
