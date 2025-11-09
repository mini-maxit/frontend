import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TasksManagementService } from '$lib/services/TasksManagementService';
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
  const tasksManagementService = new TasksManagementService(apiClient);

  const result = await tasksManagementService.uploadTask({
    title: data.title,
    archive: data.archive
  });
  if (!result.success) {
    error(result.status, { message: result.error || 'Failed to upload task.' });
  }

  await getTasks().refresh();

  return { success: true, data: result.data };
});
