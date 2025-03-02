import { z } from 'zod';
import { passwordValidationRegex } from '$lib';
import { UserRole } from '$lib/backendSchemas';
import * as m from '$lib/paraglide/messages.js';

export const editUserSchema = z.object({
	userId: z.coerce.number().positive().int(),
	username: z.string().nonempty(m.form_schema_username_required_error_message()),
	name: z.string().nonempty(m.form_schema_name_required_error_message()),
	surname: z.string().nonempty(m.form_schema_surname_required_error_message()),
	email: z.string().email(m.form_schema_invalid_email_error_message()),
	role: z.nativeEnum(UserRole)
});

export const editPasswordSchema = z
	.object({
		userId: z.coerce.number().positive().int(),
		currentPassword: z.string().nonempty(m.form_schema_password_required_error_message()),
		newPassword: z
			.string()
			.min(8)
			.max(50)
			.regex(passwordValidationRegex, m.form_schema_password_regex_error_message()),
		confirmPassword: z.string().nonempty(m.form_schema_password_required_error_message())
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: m.form_schema_password_mismatch_error_message(),
		path: ['confirmPassword']
	});

export type EditPasswordSchema = typeof editPasswordSchema;
export type EditUserSchema = typeof editUserSchema;
