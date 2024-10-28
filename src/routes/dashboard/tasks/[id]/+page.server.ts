import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { TaskPageLoad, TaskIn, TaskOut } from '$lib/components/tasks';
import { task, taskInput, taskOutput } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const taskResults = await db
		.select({
			task: task,
			input: taskInput,
			output: taskOutput
		})
		.from(task)
		.where(eq(task.id, id))
		.leftJoin(taskInput, eq(task.id, taskInput.taskId))
		.leftJoin(
			taskOutput,
			and(eq(taskInput.id, taskOutput.inputId), eq(task.id, taskOutput.taskId))
		);

	if (!taskResults.length || !taskResults[0].task) {
		throw error(404, 'Task not found');
	}

	const dbTask = taskResults[0].task;

	const inOut = {
		tasks: taskResults
			.filter((result) => result.input && result.output)
			.map(
				(result) =>
					[
						{
							filepath: result.input!.filepath,
							content: atob(result.input!.content)
						},
						{
							filepath: result.output!.filepath,
							content: atob(result.output!.content)
						}
					] as [TaskIn, TaskOut]
			)
	};

	const pageLoadTask: TaskPageLoad = {
		name: dbTask.name,
		mainFolderPath: dbTask.mainFolderPath,
		doc: {
			pdfFile: dbTask.documentPath,
			contentBase64: dbTask.documentContent
		},
		inOut
	};

	return {
		task: pageLoadTask
	};
};
