import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { type GetAllTasksResponse } from '$lib/backendSchemas';

export const load: PageServerLoad = async () => {
	const response = await fetch(`${env.BACKEND_URL}/api/v1/task`);

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
