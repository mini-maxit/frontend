export const load = async ({ parent, locals }) => {
  const parentData = await parent();
  return {
    groupId: parentData.groupId,
    currentUserId: locals.user?.userId ?? 0
  };
};
