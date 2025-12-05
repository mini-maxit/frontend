import { error } from '@sveltejs/kit';

export const load = async ({
  params,
  parent
}: {
  params: { taskId: string };
  parent: () => Promise<{ user: { userId: number; role: string } }>;
}) => {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    throw error(400, 'Invalid task ID');
  }

  const parentData = await parent();

  return {
    taskId,
    currentUserId: parentData.user.userId
  };
};
