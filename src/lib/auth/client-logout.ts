import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { AppRoutes } from '$lib/routes';
import { getAuthInstance } from '$lib/services';

/**
 * Client-side logout function
 * Can be called from any component in browser context
 */
export async function clientLogout(): Promise<void> {
  if (!browser) {
    console.error('clientLogout can only be called in browser context');
    return;
  }

  try {
    const authService = getAuthInstance();
    if (!authService) {
      console.error('Auth service not available');
      return;
    }

    const result = await authService.logout();

    if (!result.success) {
      console.error('Logout failed:', result.error);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always redirect to login, even if the API call fails
    // This ensures the user is logged out on the client side
    await goto(AppRoutes.Login);
  }
}
