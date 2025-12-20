export const load = async ({ parent }: { parent: () => Promise<{ contestId: number }> }) => {
  const parentData = await parent();

  return {
    contestId: parentData.contestId
  };
};
