import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import type { TaskListItem } from '.';

export const load: PageServerLoad = async () => {
	const all_tasks = await db
		.select({
			id: tasks.id,
			name: tasks.name
		})
		.from(tasks)
		.orderBy(tasks.createdAt ?? tasks.id);

	return {
		tasks: all_tasks as TaskListItem[]
	};
};
