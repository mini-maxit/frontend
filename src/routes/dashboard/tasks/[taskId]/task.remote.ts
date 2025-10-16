import * as v from 'valibot';
import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { SubmissionService } from '$lib/services/SubmissionService';
import { error } from '@sveltejs/kit';

export const getTask = query(v.number(), async (id: number) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.getTaskById(id);
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch task.' });
  }

  const task = result.data;
  // Fetch PDF description if available
  let pdfDataUrl: string | null = null;
  if (task.descriptionUrl) {
    try {
      const response = await fetch(task.descriptionUrl);

      if (response.ok) {
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...uint8Array));
        pdfDataUrl = `data:application/pdf;base64,${base64}`;
      }
    } catch (err) {
      // If PDF fetch fails, continue without it
      console.error('Failed to fetch PDF:', err);
    }
  }

  return {
    ...task,
    pdfDataUrl
  };
});

export const getLanguages = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const submissionService = new SubmissionService(apiClient);

  const result = await submissionService.getAvailableLanguages();
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to fetch languages.' });
  }

  return result.data || [];
});
