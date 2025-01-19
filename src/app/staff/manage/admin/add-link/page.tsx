import AddLinkForm from "@/app/_components/organisms/forms/AddLink.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { LinkType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A link with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create link.",
  default: "An unexpected error occurred. Please try again.",
};

async function addLink(linkData: {
  name: string;
  url: string;
  type: LinkType;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();
    const link = await db.link.create({
      data: {
        ...linkData,
        organization: {
          connect: {
            id: user.organization_id,
          },
        },
      },
    });

    revalidatePath("/staff/manage/admin/link-list");

    return { success: true, link };
  } catch (error) {
    console.error("Failed to add link:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function AddLink() {
  return <AddLinkForm onAdd={addLink} />;
}
