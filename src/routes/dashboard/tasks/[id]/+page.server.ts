import { db } from '$lib/server/db';
import { error, type Actions } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { tasks } from '$lib/server/db/schema';
import { FILESTORAGE_URL } from '$env/static/private';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { uploadTaskSolutionSchema } from '$lib/components/tasks/solutions/formSchema';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	let idInt: number;

	try {
		idInt = parseInt(id);
	} catch (e) {
		throw error(400, 'Invalid task id');
	}

	const dbTasks = await db
		.select({
			id: tasks.id,
			name: tasks.name
		})
		.from(tasks)
		.where(and(eq(tasks.id, idInt)));

	if (dbTasks.length === 0) {
		throw error(404, 'Task not found');
	}

	const task = dbTasks[0];

	const response = await fetch(`${FILESTORAGE_URL}/getTaskDescription?taskID=${idInt}`);

	if (!response.ok) {
		throw error(500, 'Failed to fetch task description');
	}

	return {
		task: {
			name: task.name,
			id: task.id,
			description: await response.arrayBuffer()
		},
		uploadSolutionForm: await superValidate(zod(uploadTaskSolutionSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(uploadTaskSolutionSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		// todo: implement solution upload
	}
};
