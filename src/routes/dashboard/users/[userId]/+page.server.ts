import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import * as m from '$lib/paraglide/messages.js';
import { error, type Actions } from '@sveltejs/kit';
import {
	UserRole,
	type ApiErrorResponse,
	type GetAllSubmissionsResponse,
	type GetUserResponse,
	type UserData
} from '$lib/backendSchemas';
import {
	assignUserToGroupsSchema,
	editPasswordSchema,
	editUserSchema
} from '$components/users/formSchemas';
import { fail, message, superValidate, type ErrorStatus } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { PARSE_ERROR, parse_error_response } from '$lib/server/utils';
import type { GetAllGroupsResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { userId } = params;
	let userIdInt: number;

	const localUser = locals.user!;

	try {
		userIdInt = parseInt(userId);
	} catch (e) {
		error(400, { message: m.error_invalid_user_id_error_message() });
	}

	const { userData, submissionData } = await fetchUserAndSubmissionData(
		localUser,
		userIdInt,
		locals.sessionId!
	);

	const groupsResponse = await fetch(`${env.BACKEND_URL}/api/v1/group/`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!groupsResponse.ok) {
		const errorResponse: ApiErrorResponse = await parse_error_response(groupsResponse);
		error(groupsResponse.status, {
			code: errorResponse.data.code,
			message: errorResponse.data.message
		});
	}

	const groups: GetAllGroupsResponse = await groupsResponse.json();

	return {
		editUserForm: await superValidate(
			{
				userId: userData.id,
				name: userData.name,
				email: userData.email,
				username: userData.username,
				surname: userData.surname,
				role: userData.role
			},
			zod(editUserSchema)
		),
		editPasswordForm: await superValidate(zod(editPasswordSchema)),
		assignUserToGroupsForm: await superValidate(zod(assignUserToGroupsSchema)),
		localUser: localUser,
		groups: groups.data,
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
		if (event.locals.user!.id !== form.data.userId && event.locals.user!.role !== UserRole.Admin) {
			return message(form, 'Unauthorized', {
				status: 401
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

		try {
			const response = await fetch(userUrl, {
				method: 'PATCH',
				body: jsonData,
				headers: {
					'Content-Type': 'application/json',
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
			return { form };
		} catch (e) {
			return fail(500, {
				form
			});
		}
	},

	editPassword: async (event) => {
		const form = await superValidate(event, zod(editPasswordSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (event.locals.user!.id !== form.data.userId) {
			return message(form, 'Unauthorized', {
				status: 401
			});
		}

		const changePasswordUrl = `${env.BACKEND_URL}/api/v1/user/${form.data.userId}/password`;

		const jsonData = JSON.stringify({
			old_password: form.data.currentPassword,
			new_password: form.data.newPassword,
			new_password_confirm: form.data.confirmPassword
		});

		try {
			const response = await fetch(changePasswordUrl, {
				method: 'PATCH',
				body: jsonData,
				headers: {
					'Content-Type': 'application/json',
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
			return { form };
		} catch (e) {
			return fail(500, {
				form
			});
		}
	},

	assignGroups: async (event) => {
		const form = await superValidate(event, zod(assignUserToGroupsSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (event.locals.user!.role === UserRole.Student) {
			return message(form, 'Unauthorized', {
				status: 401
			});
		}

		const { userId, groupId } = form.data;
		try {
			const jsonData = JSON.stringify({
				userIds: [userId]
			});

			const response = await fetch(`${env.BACKEND_URL}/api/v1/group/${groupId}/users`, {
				method: 'POST',
				body: jsonData,
				headers: {
					session: `${event.locals.sessionId}`
				}
			});

			if (!response.ok) {
				const errorResponse: ApiErrorResponse = await parse_error_response(response);
				if (errorResponse.data.code !== PARSE_ERROR) {
					return message(form, errorResponse.data.message, {
						status: response.status as ErrorStatus
					});
				}
				error(response.status, {
					code: errorResponse.data.code,
					message: errorResponse.data.message
				});
			}
			return { form };
		} catch (e) {
			return fail(500, {
				form
			});
		}
	}
};

const fetchUserAndSubmissionData = async (
	eventUserData: UserData,
	userIdInt: number,
	sessionId: string
) => {
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
			const errorResponse: ApiErrorResponse = await parse_error_response(submissionDataResponse);
			error(submissionDataResponse.status, {
				code: errorResponse.data.code,
				message: errorResponse.data.message
			});
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

		if (!submissionDataResponse.ok) {
			const errorResponse: ApiErrorResponse = await parse_error_response(submissionDataResponse);
			error(submissionDataResponse.status, {
				code: errorResponse.data.code,
				message: errorResponse.data.message
			});
		}

		if (!userDataResponse.ok) {
			const errorResponse: ApiErrorResponse = await parse_error_response(userDataResponse);
			error(userDataResponse.status, {
				code: errorResponse.data.code,
				message: errorResponse.data.message
			});
		}

		userData = await userDataResponse.json();
		submissionData = await submissionDataResponse.json();
	} else {
		const userDataResponse = await userDataRequest;

		if (!userDataResponse.ok) {
			const errorResponse: ApiErrorResponse = await parse_error_response(userDataResponse);
			error(userDataResponse.status, {
				code: errorResponse.data.code,
				message: errorResponse.data.message
			});
		}

		userData = await userDataResponse.json();
	}

	return { userData: userData!.data, submissionData: submissionData?.data || [] };
};
