import { error } from '@sveltejs/kit';

export const load = async ({ params }: { params: { submissionId: string } }) => {
  const submissionId = parseInt(params.submissionId, 10);

  if (isNaN(submissionId)) {
    throw error(400, 'Invalid submission ID');
  }

  return {
    submissionId
  };
};
