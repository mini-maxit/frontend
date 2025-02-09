import { z } from 'zod';

export const uploadTaskSolutionSchema = z
	.object({
		id: z.number().int().positive(),
		file: z.instanceof(File),
		language: z.object({ id: z.number().int().positive(), fileExtension: z.string() })
	})
	.superRefine((data, ctx) => {
		const extension = data.file.name.toLowerCase().split('.').pop();
		if (!data.language) {
			console.log('Language is not selected');
			ctx.addIssue({
				path: ['language'],
				message: 'Language is not selected',
				code: 'custom'
			});
		}
		if (data.language.fileExtension !== extension) {
			console.log('File extension is incorrect');
			ctx.addIssue({
				path: ['file'],
				message: `File extension must be .${data.language.fileExtension}`,
				code: 'custom'
			});
		} else {
			console.log('File extension is correct');
		}
	});

export type UploadTaskSolutionSchema = typeof uploadTaskSolutionSchema;
