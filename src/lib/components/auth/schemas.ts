import { z } from 'zod';

const passwordValidation = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		username: z.string().min(1, 'Username is required'),
		name: z.string().min(1, 'Name is required'),
		surname: z.string().min(1, 'Surname is required'),
		password: z
			.string()
			.min(6)
			.regex(
				passwordValidation,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			),
		confirmPassword: z.string().min(1, 'Password confirmation is required')
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
