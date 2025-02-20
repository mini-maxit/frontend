import { z } from 'zod';

import { passwordValidationRegex } from '$lib';

export const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		username: z.string().nonempty('Username is required'),
		name: z.string().nonempty('Name is required'),
		surname: z.string().nonempty('Surname is required'),
		password: z
			.string()
			.min(6)
			.regex(
				passwordValidationRegex,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			),
		confirmPassword: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
});

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
