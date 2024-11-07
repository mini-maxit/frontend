import { z } from 'zod';

export const uploadTaskSolutionSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => {
			const extension = file.name.toLowerCase().split('.').pop();
			return extension === 'cpp' || extension === 'py';
		}, 'File must have .cpp or .py extension')
		.refine((file) => {
			return (
				file.type === 'text/plain' || file.type === 'text/x-c++src' || file.type === 'text/x-python'
			);
		}, 'File must be a text file'),
	id: z.number().int().positive()
});

export type UploadTaskSolutionSchema = typeof uploadTaskSolutionSchema;