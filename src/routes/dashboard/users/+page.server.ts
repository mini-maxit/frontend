import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { type GetAllUsersResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/user/`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	// todo: handle this better

	if (!response.ok) {
		return {
			users: []
		};
	}

	const { data }: GetAllUsersResponse = await response.json();

	return {
		users: data
	};
};
