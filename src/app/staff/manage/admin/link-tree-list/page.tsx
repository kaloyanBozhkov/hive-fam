import Stack from "@/app/_components/layouts/Stack.layout";
import { LinkTreeList } from "@/app/staff/manage/admin/link-tree-list/table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import type { LinkTreeData } from "./table";
import { getLinkTrees } from "@/server/actions/getLinkTrees";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { LinkTreeForm } from "@/app/_components/organisms/LinkTreeForm.organism";

async function updateLinkTreeDescription(formData: {
  description: string | null;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();

    await db.organization.update({
      where: { id: user.organization_id },
      data: { link_tree_description: formData.description },
    });

    revalidatePath("/staff/manage/admin/link-tree-list");
    return { success: true };
  } catch (error) {
    console.error("Failed to update link tree description:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

const getOrgDetails = async () => {
  const user = await isAdminOrAbove();

  const org = await db.organization.findFirst({
    select: {
      link_tree_description: true,
    },
    where: {
      id: user.organization_id,
    },
  });
  return org;
};

const LinkTreePage = async () => {
  const user = await isAdminOrAbove();
  const org = await getOrgDetails();
  const linkTrees: LinkTreeData[] = await getLinkTrees(user.organization_id);
  const dataWithVisits = linkTrees.map((linkTree) => ({
    ...linkTree,
    visitsCount: linkTree.visitsCount || 0,
    visitsLast24h: linkTree.visitsLast24h || 0,
    visitsLast72h: linkTree.visitsLast72h || 0,
    visitsLastWeek: linkTree.visitsLastWeek || 0,
    visitsLastMonth: linkTree.visitsLastMonth || 0,
  }));

  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Link Tree</h2>
        <Group className="gap-2">
          <Button asChild>
            <Link href="/links">Visit Link Tree</Link>
          </Button>
          <Button asChild>
            <Link href="/staff/manage/admin/add-link-tree">Add Link</Link>
          </Button>
        </Group>
      </Group>
      <LinkTreeForm
        initialDescription={(org?.link_tree_description ?? "") as string}
        onSubmit={updateLinkTreeDescription}
      />
      <LinkTreeList data={dataWithVisits} />
    </Stack>
  );
};

export default LinkTreePage;
