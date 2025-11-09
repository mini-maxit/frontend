import * as v from 'valibot';
import { error, isHttpError, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { AuthService } from '$lib/services/AuthService';
import { createApiClient } from '$lib/services/ApiService';
import { TokenManager } from '$lib/token';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';
import * as m from '$lib/paraglide/messages';

const RegisterSchema = v.pipe(
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
    _password: v.pipe(
      v.string(m.validation_password_required()),
      v.nonEmpty(m.validation_password_required()),
      v.minLength(8, m.validation_password_min()),
      v.maxLength(50, m.validation_password_max()),
      v.regex(/[A-Z]/, m.validation_password_uppercase()),
      v.regex(/[a-z]/, m.validation_password_lowercase()),
      v.regex(/[0-9]/, m.validation_password_digit()),
      v.regex(/[!#?@$%^&*-]/, m.validation_password_special())
    ),
    _confirmPassword: v.pipe(
      v.string(m.validation_confirm_password_required()),
      v.nonEmpty(m.validation_confirm_password_required())
    )
  }),
  v.forward(
    v.partialCheck(
      [['_password'], ['_confirmPassword']],
      (input) => input._password === input._confirmPassword,
      m.validation_passwords_match()
    ),
    ['_confirmPassword']
  )
);

type RegisterData = v.InferOutput<typeof RegisterSchema>;

export const register = form(RegisterSchema, async (data: RegisterData) => {
  const event = getRequestEvent();

  const apiClient = createApiClient(event.cookies);
  const authService = new AuthService(apiClient);
  const localizedUrl = localizeUrl(new URL(AppRoutes.Dashboard, event.url.origin));
  try {
    const result = await authService.register({
      email: data.email,
      name: data.name,
      surname: data.surname,
      username: data.username,
      password: data._password,
      confirmPassword: data._confirmPassword
    });

    if (!result.success) {
      error(result.status, { message: result.error || m.error_default_message() });
    }
    if (result.data) {
      TokenManager.setAccessToken(event.cookies, result.data);
    }
  } catch (err) {
    if (isHttpError(err)) {
      error(err.status, { message: err.body.message });
    } else {
      const errorMessage = err instanceof Error ? err.message : m.error_default_message();
      error(500, { message: errorMessage });
    }
  }
  redirect(303, localizedUrl.pathname);
});
