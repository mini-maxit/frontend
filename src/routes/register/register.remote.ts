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
      v.string('Email is required'),
      v.nonEmpty('Email cannot be empty'),
      v.email('Please enter a valid email address')
    ),
    name: v.pipe(
      v.string('Name is required'),
      v.nonEmpty('Name cannot be empty'),
      v.minLength(2, 'Name must be at least 2 characters')
    ),
    surname: v.pipe(
      v.string('Surname is required'),
      v.nonEmpty('Surname cannot be empty'),
      v.minLength(2, 'Surname must be at least 2 characters')
    ),
    username: v.pipe(
      v.string('Username is required'),
      v.nonEmpty('Username cannot be empty'),
      v.minLength(3, 'Username must be at least 3 characters')
    ),
    _password: v.pipe(
      v.string('Password is required'),
      v.nonEmpty('Password cannot be empty'),
      v.minLength(6, 'Password must be at least 6 characters')
    ),
    _confirmPassword: v.pipe(
      v.string('Please confirm your password'),
      v.nonEmpty('Please confirm your password')
    )
  }),
  v.forward(
    v.partialCheck(
      [['_password'], ['_confirmPassword']],
      (input) => input._password === input._confirmPassword,
      'Passwords do not match'
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
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      error(500, { message: errorMessage });
    }
  }
  redirect(303, localizedUrl.pathname);
});
