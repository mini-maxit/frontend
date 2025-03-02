import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, type Actions } from '@sveltejs/kit';
import {
	UserRole,
	type GetAllSubmissionsResponse,
	type GetUserResponse,
	type UserData
} from '$lib/backendSchemas';
import { editPasswordSchema, editUserSchema } from '$components/users/formSchemas';
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
		editPasswordForm: await superValidate(zod(editPasswordSchema)),
		localUser: locals.user,
		user: userData,
		submissions: submissionData
	};
};

export const actions: Actions = {
	editUser: async (event) => {
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

		const jsonData = JSON.stringify({
			name: form.data.name,
			surname: form.data.surname,
			username: form.data.username,
			email: form.data.email,
			role: form.data.role.toString()
		});

		const response = await fetch(userUrl, {
			method: 'PATCH',
			body: jsonData,
			headers: {
				'Content-Type': 'application/json',
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
	},

	editPassword: async (event) => {
		const form = await superValidate(event, zod(editPasswordSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const changePasswordUrl = `${env.BACKEND_URL}/api/v1/user/${form.data.userId}/password`;

		const jsonData = JSON.stringify({
			old_password: form.data.currentPassword,
			new_password: form.data.newPassword,
			new_password_confirm: form.data.confirmPassword
		});

		const response = await fetch(changePasswordUrl, {
			method: 'PATCH',
			body: jsonData,
			headers: {
				'Content-Type': 'application/json',
				session: `${event.locals.sessionId}`
			}
		});

		if (!response.ok) {
			return fail(500, {
				form,
				error: 'Failed to update password'
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

		if (eventUserData.role === UserRole.Admin) {
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
