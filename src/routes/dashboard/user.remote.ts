import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import type { ApiResponse } from '$lib/dto/response';
import { error } from '@sveltejs/kit';

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  username: string;
  role: string;
}

export const getCurrentUser = query(async (): Promise<User> => {
  const { cookies, locals } = getRequestEvent();

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const apiClient = createApiClient(cookies);
    const response = await apiClient.get<ApiResponse<User>>({
      url: `/users/${locals.user.userId}`
    });

    return response.data;
  } catch (err) {
    console.error('Failed to load user:', err);
    throw error(500, 'Failed to load user data');
  }
});
