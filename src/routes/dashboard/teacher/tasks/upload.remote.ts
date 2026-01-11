import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TasksManagementService } from '$lib/services/TasksManagementService';
import { error } from '@sveltejs/kit';
import { getTasks } from './tasks.remote';

const UploadTaskSchema = v.object({
  title: v.pipe(v.string('Title is required'), v.nonEmpty('Title cannot be empty')),
  archive: v.instance(File, 'Task archive is required'),
  isVisible: v.optional(v.boolean(), false)
});

type UploadTaskData = v.InferOutput<typeof UploadTaskSchema>;

export const uploadTask = form(UploadTaskSchema, async (data: UploadTaskData) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const tasksManagementService = new TasksManagementService(apiClient);

  const result = await tasksManagementService.uploadTask({
    title: data.title,
    archive: data.archive,
    isVisible: data.isVisible ?? false
  });
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to upload task.' });
  }

  await getTasks().refresh();

  return { success: true, data: result.data };
});

export const getUploadLimit = query(async () => {
  const raw = (process.env.BODY_SIZE_LIMIT ?? '512K').trim();
  if (/^infinity$/i.test(raw)) {
    return { raw, bytes: Number.POSITIVE_INFINITY };
  }
  const match = raw.match(/^(\d+(?:\.\d+)?)([KMG])?$/i);
  let bytes: number;
  if (match) {
    const value = parseFloat(match[1]);
    const unit = (match[2] || '').toUpperCase();
    if (unit === 'K') bytes = Math.round(value * 1024);
    else if (unit === 'M') bytes = Math.round(value * 1024 * 1024);
    else if (unit === 'G') bytes = Math.round(value * 1024 * 1024 * 1024);
    else bytes = Math.round(value);
  } else {
    // Fallback to default adapter-node limit if malformed
    bytes = 512 * 1024;
  }
  return { raw, bytes };
});
