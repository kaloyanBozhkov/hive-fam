import AddLinkTreeForm from "@/app/_components/organisms/forms/AddLinkTree.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const errorMessages: Record<string, string> = {
  P2002: "A link tree with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create link tree.",
  default: "An unexpected error occurred. Please try again.",
};

async function addLinkTree(linkTreeData: {
  name: string;
  url: string;
  order: number;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();
    const linkTree = await db.link_tree.create({
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
    console.error("Failed to add link tree:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function AddLinkTree() {
  return <AddLinkTreeForm onAdd={addLinkTree} />;
}
