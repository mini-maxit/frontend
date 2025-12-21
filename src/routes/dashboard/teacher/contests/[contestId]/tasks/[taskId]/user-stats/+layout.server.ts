import { error } from '@sveltejs/kit';

export const load = async ({
  params,
  parent
}: {
  params: { contestId: string; taskId: string };
  parent: () => Promise<{ contestId: number }>;
}) => {
  const taskId = parseInt(params.taskId, 10);
  const parentData = await parent();

  if (isNaN(taskId)) {
    throw error(400, 'Invalid task ID');
  }

  return {
    contestId: parentData.contestId,
    taskId
  };
};
