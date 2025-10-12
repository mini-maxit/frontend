import * as v from 'valibot';
import { error, isHttpError, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { AuthService } from '$lib/services/AuthService';
import { createApiClient } from '$lib/services/ApiService';
import { TokenManager } from '$lib/token';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';
import * as m from '$lib/paraglide/messages';

const LoginSchema = v.object({
  email: v.pipe(
    v.string('Email is required'),
    v.nonEmpty('Email cannot be empty'),
    v.email('Please enter a valid email address')
  ),
  _password: v.pipe(
    v.string('Password is required'),
    v.nonEmpty('Password cannot be empty'),
    v.minLength(6, 'Password must be at least 6 characters')
  )
});

type LoginData = v.InferOutput<typeof LoginSchema>;

export const login = form(LoginSchema, async (data: LoginData) => {
  const event = getRequestEvent();
  const redirectToParam = event.url.searchParams.get('redirectTo');

  const targetPath = redirectToParam || AppRoutes.Dashboard;
  const localizedUrl = localizeUrl(new URL(targetPath, event.url.origin));
  const redirectTo = localizedUrl.pathname;

  const apiClient = createApiClient(event.cookies);
  const authService = new AuthService(apiClient);

  try {
    const result = await authService.login({
      email: data.email,
      password: data._password
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
  redirect(303, redirectTo);
});
