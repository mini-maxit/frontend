export const load = async ({ params }: { params: { taskId: string } }) => {
  return {
    taskId: parseInt(params.taskId, 10)
  };
};
