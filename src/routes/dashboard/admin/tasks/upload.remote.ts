import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { error } from '@sveltejs/kit';
import { getTasks } from './tasks.remote';

const UploadTaskSchema = v.object({
  title: v.pipe(v.string('Title is required'), v.nonEmpty('Title cannot be empty')),
  archive: v.instance(File, 'Task archive is required')
});

type UploadTaskData = v.InferOutput<typeof UploadTaskSchema>;

export const uploadTask = form(UploadTaskSchema, async (data: UploadTaskData) => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.uploadTask(data.title, data.archive);
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to upload task.' });
  }

  await getTasks().refresh();

  return { success: true, data: result.data };
});
