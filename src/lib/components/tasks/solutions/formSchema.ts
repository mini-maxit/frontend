import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const uploadTaskSolutionSchema = z.object({
	id: z.number().int().positive(),
	file: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'Plik jest za duży! Maksymalny rozmiar pliku to 10MB.'
		})
		.superRefine(async (file, ctx) => {
			const text = await file.text();
			if (!/^[\x00-\x7F]*$/.test(text.slice(0, 100))) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Plik nie wygląda na tekstowy!'
				});
			}
		}),
	languageId: z.number().int().positive()
});

export type UploadTaskSolutionSchema = typeof uploadTaskSolutionSchema;
