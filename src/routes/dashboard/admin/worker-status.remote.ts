import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { WorkerService } from '$lib/services/WorkerService';
import { error } from '@sveltejs/kit';

export const getWorkerStatus = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const workerService = new WorkerService(apiClient);

  const result = await workerService.getWorkerStatus();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch worker status.' });
  }
  return result.data;
});
