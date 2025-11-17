import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { contestId: string } }) => {
  const contestId = parseInt(params.contestId, 10);

  if (isNaN(contestId)) {
    throw error(400, 'Invalid contest ID');
  }

  return {
    contestId
  };
};
