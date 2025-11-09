import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { WorkerService } from '$lib/services/WorkerService';
import { error } from '@sveltejs/kit';

export const getWorkerStatus = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const workerService = new WorkerService(apiClient);

  try {
    return await workerService.getWorkerStatus();
  } catch (err) {
    console.error('Failed to fetch worker status:', err);
    error(500, { message: 'Failed to fetch worker status.' });
  }
});
