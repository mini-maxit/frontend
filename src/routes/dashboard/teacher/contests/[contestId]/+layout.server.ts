import { error } from '@sveltejs/kit';

export const load = async ({
  params,
  parent
}: {
  params: { contestId: string };
  parent: () => Promise<{ user: { userId: number; role: string } }>;
}) => {
  const contestId = parseInt(params.contestId, 10);

  if (isNaN(contestId)) {
    throw error(400, 'Invalid contest ID');
  }

  const parentData = await parent();

  return {
    contestId,
    currentUserId: parentData.user.userId
  };
};
