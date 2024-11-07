import {
	serial,
	pgTable,
	text,
	integer,
	timestamp,
	pgEnum,
	real,
	boolean,
	varchar,
	primaryKey
} from 'drizzle-orm/pg-core';

export const submissionStatusEnum = pgEnum('user_solution_status', [
	'submitted',
	'queued',
	'executed'
]);
export const languageTypeEnum = pgEnum('language_type', ['CPP', 'C', 'Python']);
export const submissionResultStatusEnum = pgEnum('user_solution_result_status', [
	'succes',
	'failed',
	'InternalError'
]);
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	surname: text('surname').notNull(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const tasks = pgTable('tasks', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	createdById: integer('created_by_id')
		.notNull()
		.references(() => users.id)
});

export const languageConfig = pgTable('language_config', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 50 }).notNull(),
	version: varchar('version', { length: 50 }).notNull()
});

export const submissions = pgTable('submissions', {
	id: serial('id').primaryKey(),
	taskId: integer('task_id').references(() => tasks.id),
	userId: integer('user_id').references(() => users.id),
	order: integer('order').notNull(),
	languageId: integer('language_id').references(() => languageConfig.id),
	status: submissionStatusEnum('status').notNull(),
	submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
	checkedAt: timestamp('checked_at', { withTimezone: true })
});

export const inputOutput = pgTable('input_output', {
	id: serial('id').primaryKey(),
	taskId: integer('task_id').references(() => tasks.id),
	order: integer('order').notNull(),
	timeLimit: real('time_limit').notNull(),
	memoryLimit: real('memory_limit').notNull()
});

export const submissionResults = pgTable('submission_results', {
	id: serial('id').primaryKey(),
	submissionId: integer('user_solution_id').references(() => submissions.id),
	statusCode: submissionResultStatusEnum('status_code').notNull(),
	message: varchar('message', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const testResults = pgTable('test_results', {
	id: serial('id').primaryKey(),
	submissionResultId: integer('user_solution_result_id').references(() => submissionResults.id),
	inputOutputId: integer('input_output_id').references(() => inputOutput.id),
	passed: boolean('passed').notNull(),
	errorMessage: varchar('error_message')
});

export const groups = pgTable('groups', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull()
});

export const userGroup = pgTable(
	'user_group',
	{
		userId: integer('user_id').references(() => users.id),
		groupId: integer('group_id').references(() => groups.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.groupId] })
	})
);

export const taskGroup = pgTable(
	'task_group',
	{
		taskId: integer('task_id').references(() => tasks.id),
		groupId: integer('group_id').references(() => groups.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.taskId, table.groupId] })
	})
);

export const taskUser = pgTable(
	'task_user',
	{
		taskId: integer('task_id').references(() => tasks.id),
		userId: integer('user_id').references(() => users.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.taskId, table.userId] })
	})
);

export const queueMessages = pgTable('queue_messages', {
	id: text('id').primaryKey(),
	submissionId: integer('user_solution_id').references(() => submissions.id),
	queuedAt: timestamp('queued_at', { withTimezone: true }).defaultNow()
});

export type Session = typeof session.$inferSelect;
export type User = typeof users.$inferSelect;
