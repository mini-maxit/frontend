import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';
import { ACCESS_TOKEN_KEY } from '$lib/token';
import { authService } from '$lib/services/AuthService';

export const actions: Actions = {
  logout: async ({ cookies, url }) => {
    await authService.logout();

    cookies.delete(ACCESS_TOKEN_KEY, { path: '/' });

    const localizedUrl = localizeUrl(new URL(AppRoutes.Login, url.origin));
    redirect(303, localizedUrl.pathname);
  }
};
