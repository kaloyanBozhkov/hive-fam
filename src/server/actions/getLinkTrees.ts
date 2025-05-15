import { db } from "@/server/db"; // Import your database instance
import type { LinkTreeData } from "@/app/staff/manage/admin/link-tree-list/table"; // Import the LinkTreeData type

export const getLinkTrees = async (
  organizationId: string,
): Promise<LinkTreeData[]> => {
  // Fetch link trees along with their visit counts
  const linkTrees = await db.link_tree.findMany({
    where: {
      organization_id: organizationId,
    },
    orderBy: {
      order: "asc",
    },
  });

  const visits = await db.link_tree_visit.findMany({
    where: {
      OR: linkTrees.map((linkTree) => ({
        link_tree_id: linkTree.id,
        ...(linkTree.last_reset_at
          ? {
              created_at: {
                gte: linkTree.last_reset_at as unknown as Date,
              },
            }
          : {}),
      })),
    },
    select: {
      link_tree_id: true,
      created_at: true,
    },
  });

  // Process the link trees to calculate visit counts
  return linkTrees.map((linkTree) => {
    const linkTreeVisits = visits.filter(
      (visit) => visit.link_tree_id === linkTree.id,
    );
    const visitsCount = linkTreeVisits.length; // Total visits
    const visitsLast24h = linkTreeVisits.filter((visit) => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= twentyFourHoursAgo;
    }).length;

    const visitsLast72h = linkTreeVisits.filter((visit) => {
      const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= seventyTwoHoursAgo;
    }).length;

    const visitsLastWeek = linkTreeVisits.filter((visit) => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= oneWeekAgo;
    }).length;

    const visitsLastMonth = linkTreeVisits.filter((visit) => {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= oneMonthAgo;
    }).length;

    return {
      ...linkTree,
      visitsCount,
      visitsLast24h,
      visitsLast72h,
      visitsLastWeek,
      visitsLastMonth,
    };
  });
};
