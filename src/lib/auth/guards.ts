import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { tokenStore } from '$lib/stores/token-store.svelte';
import { userStore } from '$lib/stores/user-store.svelte';
import { getApiInstance, getUserInstance } from '$lib/stores/service-instances.svelte';
import { AppRoutes } from '$lib/routes';

/**
 * Client-side authentication guard
 * Ensures user is authenticated before accessing protected routes
 * Performs silent refresh if no access token is present
 * Fetches user data if not already loaded
 *
 * @param url - Current URL being accessed
 * @throws redirect - Redirects to login if authentication fails
 *
 * @example
 * ```typescript
 * // In +layout.ts
 * export const load: LayoutLoad = async ({ url }) => {
 *   await requireAuth(url);
 *   return {};
 * };
 * ```
 */
export async function requireAuth(url: URL): Promise<void> {
	// Skip auth check during SSR - will be handled on client-side
	if (!browser) {
		return;
	}

	// Check if we have an access token
	if (!tokenStore.hasToken()) {
		// No token - try silent refresh using HTTP-only refresh cookie
		const apiClient = getApiInstance();
		if (apiClient) {
			try {
				const refreshed = await apiClient.silentRefresh();
				if (!refreshed) {
					// Silent refresh failed - redirect to login with return URL
					const redirectTo = url.pathname + url.search;
					throw redirect(303, `${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
				}
			} catch (error) {
				// Silent refresh error - redirect to login
				const redirectTo = url.pathname + url.search;
				throw redirect(303, `${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
			}
		} else {
			// No API client available - redirect to login
			throw redirect(303, AppRoutes.Login);
		}
	}

	// Token exists - fetch user data if not already loaded
	if (!userStore.tryGetUser() && !userStore.isLoading()) {
		const userService = getUserInstance();
		if (userService) {
			try {
				const result = await userService.getCurrentUser();
				if (!result.success) {
					// Failed to fetch user - clear token and redirect
					tokenStore.clearAccessToken();
					const redirectTo = url.pathname + url.search;
					throw redirect(303, `${AppRoutes.Login}?redirectTo=${encodeURIComponent(redirectTo)}`);
				}
			} catch (error) {
				// Error fetching user - clear token and redirect
				console.error('Failed to fetch user:', error);
				tokenStore.clearAccessToken();
				throw redirect(303, AppRoutes.Login);
			}
		}
	}
}

/**
 * Optional authentication guard
 * Attempts to load user data if token exists, but doesn't require authentication
 * Useful for pages that work for both authenticated and unauthenticated users
 *
 * @example
 * ```typescript
 * // In +layout.ts for public pages
 * export const load: LayoutLoad = async () => {
 *   await optionalAuth();
 *   return {};
 * };
 * ```
 */
export async function optionalAuth(): Promise<void> {
	if (!browser) {
		return;
	}

	// Try silent refresh if no token
	if (!tokenStore.hasToken()) {
		const apiClient = getApiInstance();
		if (apiClient) {
			try {
				await apiClient.silentRefresh();
			} catch (error) {
				// Silent refresh failed - user remains unauthenticated
				console.debug('Silent refresh failed:', error);
			}
		}
	}

	// If token exists, try to fetch user
	if (tokenStore.hasToken() && !userStore.tryGetUser() && !userStore.isLoading()) {
		const userService = getUserInstance();
		if (userService) {
			try {
				await userService.getCurrentUser();
			} catch (error) {
				// Failed to fetch user - clear invalid token
				console.debug('Failed to fetch user:', error);
				tokenStore.clearAccessToken();
			}
		}
	}
}
