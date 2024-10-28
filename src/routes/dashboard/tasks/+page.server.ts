import { db } from '$lib/server/db';
import { task } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import type { TaskListItem } from '.';

export const load: PageServerLoad = async () => {
	const tasks = await db
		.select({
			id: task.id,
			name: task.name,
			mainFolderPath: task.mainFolderPath
		})
		.from(task)
		.orderBy(task.createdAt ?? task.id);

	return {
		tasks: tasks as TaskListItem[]
	};
};
