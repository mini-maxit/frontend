import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { localizeUrl } from '$lib/paraglide/runtime';
import { AppRoutes } from '$lib/routes';
import { ACCESS_TOKEN_KEY } from '$lib/token';
import { AuthService } from '$lib/services/AuthService';
import { createApiClient } from '$lib/services/ApiService';

export const actions: Actions = {
  logout: async ({ cookies, url }) => {
    // Create API client with cookies for this request
    const apiClient = createApiClient(cookies);
    const authService = new AuthService(apiClient);

    await authService.logout();

    cookies.delete(ACCESS_TOKEN_KEY, { path: '/' });

    const localizedUrl = localizeUrl(new URL(AppRoutes.Login, url.origin));
    redirect(303, localizedUrl.pathname);
  }
};
