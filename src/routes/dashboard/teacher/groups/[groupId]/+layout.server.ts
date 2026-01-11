export const load = async ({ params }: { params: { groupId: string } }) => {
  return {
    groupId: Number(params.groupId)
  };
};
