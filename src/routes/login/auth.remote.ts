import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { authService } from '$lib/services/AuthService';
import { ApiError } from '$lib/services/ApiService';
import { TokenManager } from '$lib/token';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';

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

  // Localize the redirect URL for server-side redirect
  const targetPath = redirectToParam || AppRoutes.Dashboard;
  const localizedUrl = localizeUrl(new URL(targetPath, event.url.origin));
  const redirectTo = localizedUrl.pathname;

  try {
    const result = await authService.login({
      email: data.email,
      password: data._password
    });

    if (!result.success || !result.data) {
      error(400, result.error || 'Login failed');
    }

    TokenManager.setAccessToken(result.data.access_token, result.data.expires_in);
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof ApiError) {
      error(err.status || 500);
    }
    throw err;
  }

  redirect(303, redirectTo);
});
