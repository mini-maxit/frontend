import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { insertTask } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { Task, TaskInOut } from '$lib/components/tasks';

export const actions = {
    uploadTask: async ({ request }) => {
        const formData = await request.formData();
        
        try {
            const userId = formData.get('userId')?.toString();
            const zipFile = formData.get('zipFile') as File;
            
            if (!userId || !zipFile) {
                return fail(400, {
                    type: 'error',
                    error: 'Brak wymaganych danych'
                });
            }

            // Parse the metadata that was sent separately
            const mainFolderPath = formData.get('mainFolderPath')?.toString();
            const docContent = formData.get('docBlob') as Blob;
            const docPath = formData.get('docPath')?.toString();
            const inOutTasksJson = formData.get('inOutTasks')?.toString();

            if (!mainFolderPath || !docPath || !inOutTasksJson) {
                return fail(400, {
                    type: 'error',
                    error: 'Brak wymaganych metadanych'
                });
            }

            // Reconstruct the Task object
            const task: Task = {
                mainFolderPath,
                doc: {
                    pdfFile: docPath,
                    content: docContent
                },
                inOut: JSON.parse(inOutTasksJson) as TaskInOut
            };
            
            // Insert the task into the database
            const taskId = await insertTask(db, userId, task);

            return {
                type: 'success',
                data: { taskId }
            };
        } catch (error) {
            console.error('Error uploading task:', error);
            return fail(500, {
                type: 'error',
                error: 'Wystąpił błąd podczas zapisywania zadania'
            });
        }
    }
} satisfies Actions;