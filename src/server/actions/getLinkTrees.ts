import { db } from "@/server/db"; // Import your database instance
import { LinkTreeData } from "@/app/staff/manage/admin/link-tree-list/table"; // Import the LinkTreeData type

export const getLinkTrees = async (
  organizationId: string,
): Promise<LinkTreeData[]> => {
  // Fetch link trees along with their visit counts
  const linkTrees = await db.link_tree.findMany({
    where: {
      organization_id: organizationId,
    },
    include: {
      to_visits: {
        select: {
          created_at: true, // Assuming you have a timestamp for visits
        },
      },
    },
  });

  // Process the link trees to calculate visit counts
  return linkTrees.map((linkTree) => {
    const visitsCount = linkTree.to_visits.length; // Total visits
    const visitsLast24h = linkTree.to_visits.filter((visit) => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= twentyFourHoursAgo;
    }).length;

    const visitsLast72h = linkTree.to_visits.filter((visit) => {
      const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= seventyTwoHoursAgo;
    }).length;

    const visitsLastWeek = linkTree.to_visits.filter((visit) => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(visit.created_at) >= oneWeekAgo;
    }).length;

    const visitsLastMonth = linkTree.to_visits.filter((visit) => {
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
