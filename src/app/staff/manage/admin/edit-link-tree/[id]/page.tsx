import EditLinkTreeForm, {
  type linkTreeSchema,
} from "@/app/_components/organisms/forms/EditLinkTree.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { resetMetrics } from "@/server/actions/linkTree/resetMetrics";

const errorMessages: Record<string, string> = {
  P2002: "A link tree with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update link tree.",
  default: "An unexpected error occurred. Please try again.",
};

async function getLinkTree(id: string) {
  return await db.link_tree.findUnique({
    where: { id },
  });
}

async function editLinkTree(linkTreeData: z.infer<typeof linkTreeSchema>) {
  "use server";
  try {
    const user = await isAdminOrAbove();
    const linkTree = await db.link_tree.update({
      where: { id: linkTreeData.id },
      data: {
        ...linkTreeData,
        organization: {
          connect: {
            id: user.organization_id,
          },
        },
      },
    });

    revalidatePath("/staff/manage/admin/link-tree-list");

    return { success: true, linkTree };
  } catch (error) {
    console.error("Failed to update link tree:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function EditLinkTree({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const linkTree = await getLinkTree((await params).id);
  if (!linkTree) {
    throw new Error("Link tree not found");
  }

  return (
    <EditLinkTreeForm
      initialData={linkTree}
      onEdit={editLinkTree}
      onResetMetrics={() => resetMetrics(linkTree.id)}
    />
  );
}
