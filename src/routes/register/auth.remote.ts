import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { authService } from '$lib/services/AuthService';
import { ApiError } from '$lib/services/ApiService';
import { TokenManager } from '$lib/token';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';

const RegisterSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Name is required'),
      v.nonEmpty('Name cannot be empty'),
      v.minLength(2, 'Name must be at least 2 characters')
    ),
    email: v.pipe(
      v.string('Email is required'),
      v.nonEmpty('Email cannot be empty'),
      v.email('Please enter a valid email address')
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

  try {
    const result = await authService.register({
      name: data.name,
      email: data.email,
      password: data._password
    });

    if (!result.success || !result.data) {
      error(400, result.error || 'Registration failed');
    }

    TokenManager.setAccessToken(result.data.access_token, result.data.expires_in);
  } catch (err) {
    console.error('Registration error:', err);
    if (err instanceof ApiError) {
      error(err.status || 500);
    }
    throw err;
  }

  const localizedUrl = localizeUrl(new URL(AppRoutes.Dashboard, event.url.origin));
  redirect(303, localizedUrl.pathname);
});
