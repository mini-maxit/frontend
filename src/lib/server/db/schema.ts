import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { blobToBase64 } from './utils';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const task = pgTable('task', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	createdById: text('created_by_id')
		.notNull()
		.references(() => user.id),
	mainFolderPath: text('main_folder_path').notNull(),
	documentPath: text('document_path').notNull(),
	documentContent: text('document_content').notNull()
});

export const taskInput = pgTable('task_input', {
	id: text('id').primaryKey(),
	taskId: text('task_id')
		.notNull()
		.references(() => task.id),
	filepath: text('filepath').notNull(),
	content: text('content').notNull(),
	inputNumber: integer('input_number').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const taskOutput = pgTable('task_output', {
	id: text('id').primaryKey(),
	taskId: text('task_id')
		.notNull()
		.references(() => task.id),
	inputId: text('input_id')
		.notNull()
		.references(() => taskInput.id),
	filepath: text('filepath').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export async function insertTask(
	db: PostgresJsDatabase<Record<string, never>>,
	userId: string,
	taskData: {
		mainFolderPath: string;
		doc: { pdfFile: string; content: Blob };
		inOut: {
			tasks: Array<[{ filepath: string; content: string }, { filepath: string; content: string }]>;
		};
	}
) {
	const taskId = crypto.randomUUID();

	const docBase64 = await blobToBase64(taskData.doc.content);

	await db.insert(task).values({
		id: taskId,
		createdById: userId,
		mainFolderPath: taskData.mainFolderPath,
		documentPath: taskData.doc.pdfFile,
		documentContent: docBase64
	});

	for (const [index, [input, output]] of taskData.inOut.tasks.entries()) {
		const inputId = crypto.randomUUID();

		await db.insert(taskInput).values({
			id: inputId,
			taskId,
			filepath: input.filepath,
			content: btoa(input.content),
			inputNumber: index + 1
		});

		await db.insert(taskOutput).values({
			id: crypto.randomUUID(),
			taskId,
			inputId,
			filepath: output.filepath,
			content: btoa(output.content)
		});
	}

	return taskId;
}

export type Task = typeof task.$inferSelect;
export type TaskInput = typeof taskInput.$inferSelect;
export type TaskOutput = typeof taskOutput.$inferSelect;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
