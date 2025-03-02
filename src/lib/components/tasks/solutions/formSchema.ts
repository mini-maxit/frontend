import { z } from 'zod';
import * as m from '$lib/paraglide/messages.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const uploadTaskSolutionSchema = z.object({
	id: z.number().int().positive(),
	file: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: m.form_schema_file_too_large_error_message()
		})
		.superRefine(async (file, ctx) => {
			const text = await file.text();
			if (!/^[\x00-\x7F]*$/.test(text.slice(0, 100))) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: m.form_schema_file_not_text_error_message()
				});
			}
		}),
	languageId: z.number().int().positive()
});

export type UploadTaskSolutionSchema = typeof uploadTaskSolutionSchema;
