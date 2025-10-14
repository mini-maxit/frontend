import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/services/ApiService';
import type { ContestListResponse } from '$lib/dto/contest';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  try {
    const apiClient = createApiClient(cookies);
    const response = await apiClient.get<ContestListResponse>({
      url: '/contest/'
    });

    return {
      contests: response.data
    };
  } catch (err) {
    console.error('Failed to fetch contests:', err);
    error(500, 'Failed to load contests');
  }
};
