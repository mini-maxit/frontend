import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { taskId: string } }) => {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    throw error(500, 'Invalid task ID');
  }

  return {
    taskId
  };
};
