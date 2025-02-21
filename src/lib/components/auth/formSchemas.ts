import { z } from 'zod';

import { passwordValidationRegex } from '$lib';
import * as m from '$lib/paraglide/messages.js';

export const registerSchema = z
	.object({
		email: z.string().email(m.form_schema_invalid_email_error_message()),
		username: z.string().nonempty(m.form_schema_username_required_error_message()),
		name: z.string().nonempty(m.form_schema_name_required_error_message()),
		surname: z.string().nonempty(m.form_schema_surname_required_error_message()),
		password: z
			.string()
			.min(6)
			.regex(passwordValidationRegex, m.form_schema_password_regex_error_message()),
		confirmPassword: z.string().nonempty(m.form_schema_password_required_error_message())
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: m.form_schema_password_mismatch_error_message(),
		path: ['confirmPassword']
	});

export const loginSchema = z.object({
	email: z.string().email(m.form_schema_invalid_email_error_message()),
	password: z.string().nonempty(m.form_schema_password_required_error_message())
});

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
