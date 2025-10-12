import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { AuthService } from '$lib/services/AuthService';
import { createApiClient } from '$lib/services/ApiService';
import { ACCESS_TOKEN_KEY } from '$lib/token';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';
import * as m from '$lib/paraglide/messages';

const LogoutSchema = v.object({});

type LogoutData = v.InferOutput<typeof LogoutSchema>;

export const logout = form(LogoutSchema, async (data: LogoutData) => {
  const event = getRequestEvent();

  const apiClient = createApiClient(event.cookies);
  const authService = new AuthService(apiClient);

  try {
    await authService.logout();

    event.cookies.delete(ACCESS_TOKEN_KEY, { path: '/' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : m.error_unknown_error();
    error(500, { message: errorMessage });
  }

  const localizedUrl = localizeUrl(new URL(AppRoutes.Login, event.url.origin));
  redirect(303, localizedUrl.pathname);
});
