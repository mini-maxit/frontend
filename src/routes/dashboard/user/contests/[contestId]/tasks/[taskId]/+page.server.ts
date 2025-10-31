import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { contestId: string; taskId: string } }) => {
  const contestId = parseInt(params.contestId, 10);
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(contestId)) {
    throw error(500, 'Invalid contest ID');
  }

  if (isNaN(taskId)) {
    throw error(500, 'Invalid task ID');
  }

  return {
    contestId,
    taskId
  };
};
