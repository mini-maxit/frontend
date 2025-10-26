import { createApiClient } from '$lib/services/ApiService';
import { UserService } from '$lib/services/UserService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  try {
    const apiClient = createApiClient(cookies);
    const userService = new UserService(apiClient);

    const user = await userService.getCurrentUser();

    return {
      user
    };
  } catch (err) {
    console.error('Failed to load user profile:', err);
    throw error(500, 'Failed to load profile data');
  }
};
