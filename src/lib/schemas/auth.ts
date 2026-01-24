import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

/**
 * Login schema for client-side authentication
 * Matches the validation rules from login.remote.ts
 */
export const LoginSchema = v.object({
  email: v.pipe(
    v.string(m.validation_email_required()),
    v.nonEmpty(m.validation_email_required()),
    v.email(m.validation_email_invalid())
  ),
  password: v.pipe(
    v.string(m.validation_password_required()),
    v.nonEmpty(m.validation_password_required())
  )
});

/**
 * Register schema for client-side authentication
 * Matches the validation rules from register.remote.ts
 */
export const RegisterSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(m.validation_email_required()),
      v.nonEmpty(m.validation_email_required()),
      v.email(m.validation_email_invalid())
    ),
    name: v.pipe(
      v.string(m.validation_name_required()),
      v.nonEmpty(m.validation_name_required()),
      v.minLength(3, m.validation_name_min()),
      v.maxLength(50, m.validation_name_max())
    ),
    surname: v.pipe(
      v.string(m.validation_surname_required()),
      v.nonEmpty(m.validation_surname_required()),
      v.minLength(3, m.validation_surname_min()),
      v.maxLength(50, m.validation_surname_max())
    ),
    username: v.pipe(
      v.string(m.validation_username_required()),
      v.nonEmpty(m.validation_username_required()),
      v.minLength(3, m.validation_username_min()),
      v.maxLength(30, m.validation_username_max()),
      v.regex(/^[a-zA-Z]/, m.validation_username_start()),
      v.regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, m.validation_username_pattern())
    ),
    password: v.pipe(
      v.string(m.validation_password_required()),
      v.nonEmpty(m.validation_password_required()),
      v.minLength(8, m.validation_password_min()),
      v.maxLength(50, m.validation_password_max()),
      v.regex(/[A-Z]/, m.validation_password_uppercase()),
      v.regex(/[a-z]/, m.validation_password_lowercase()),
      v.regex(/[0-9]/, m.validation_password_digit()),
      v.regex(/[!#?@$%^&*-]/, m.validation_password_special())
    ),
    confirmPassword: v.pipe(
      v.string(m.validation_confirm_password_required()),
      v.nonEmpty(m.validation_confirm_password_required())
    )
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      m.validation_passwords_match()
    ),
    ['confirmPassword']
  )
);

export type LoginInput = v.InferInput<typeof LoginSchema>;
export type RegisterInput = v.InferInput<typeof RegisterSchema>;
