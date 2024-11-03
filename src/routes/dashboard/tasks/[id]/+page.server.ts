import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { type TaskDisplayData } from '$lib/components/tasks';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		parseInt(id);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	// todo: implement this to fetch the task according to the TaskDisplayData schema

	return {
		// task: pageLoadTask
	};
};
