import { z } from 'zod';
import { passwordValidationRegex } from '$lib';

export const editUserSchema = z
	.object({
		userId: z.coerce.number().positive().int(),
		username: z.string().nonempty('Username is required'),
		name: z.string().nonempty('Name is required'),
		surname: z.string().nonempty('Surname is required'),
		currentPassword: z.string().optional(),
		newPassword: z.string().optional(),
		confirmPassword: z.string().optional()
	})
	.refine(
		(data) => {
			if (data.newPassword || data.confirmPassword || data.currentPassword) {
				return data.newPassword && data.confirmPassword && data.currentPassword;
			}
			return true;
		},
		{
			message: 'All password fields must be filled if changing password',
			path: ['currentPassword']
		}
	)
	.refine(
		(data) => {
			if (data.newPassword) {
				return passwordValidationRegex.test(data.newPassword);
			}
			return true;
		},
		{
			message:
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			path: ['newPassword']
		}
	)
	.refine(
		(data) => {
			if (data.newPassword) {
				return data.newPassword === data.confirmPassword;
			}
			return true;
		},
		{
			message: 'Passwords do not match',
			path: ['confirmPassword']
		}
	);

export type EditUserSchema = typeof editUserSchema;
