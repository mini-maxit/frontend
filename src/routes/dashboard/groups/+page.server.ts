import { env } from '$env/dynamic/private';
import type { GetAllGroupsResponse } from '$lib/backendSchemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/group/`, {
		headers: {
			session: `${locals.sessionId}`
		}
	});

	if (!response.ok) {
		return {
			groups: []
		};
	}

	const { data }: GetAllGroupsResponse = await response.json();

	return {
		groups: data
	};
};
