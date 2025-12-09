import { error } from '@sveltejs/kit';

export const load = async ({
  params,
  locals
}: {
  params: { contestId: string };
  locals: App.Locals;
}) => {
  const contestId = parseInt(params.contestId, 10);

  if (isNaN(contestId)) {
    throw error(400, 'Invalid contest ID');
  }

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  return {
    contestId,
    currentUserId: locals.user.userId
  };
};
