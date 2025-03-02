import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { type GetAllTasksResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async ({ locals }) => {
	const response = await fetch(
		`${env.BACKEND_URL}/api/v1/task/?` +
			new URLSearchParams({
				limit: '20'
			}),
		{
			headers: {
				session: `${locals.sessionId}`
			}
		}
	);

	// todo: handle this better

	if (!response.ok) {
		return {
			tasks: []
		};
	}

	const { data }: GetAllTasksResponse = await response.json();

	return {
		tasks: data
	};
};
