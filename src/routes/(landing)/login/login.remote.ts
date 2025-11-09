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
    v.string(m.validation_email_required()),
    v.nonEmpty(m.validation_email_required()),
    v.email(m.validation_email_invalid())
  ),
  _password: v.pipe(
    v.string(m.validation_password_required()),
    v.nonEmpty(m.validation_password_required())
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
      const errorMessage = err instanceof Error ? err.message : m.error_default_message();
      error(500, { message: errorMessage });
    }
  }
  redirect(303, redirectTo);
});
