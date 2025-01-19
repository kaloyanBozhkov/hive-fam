import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import EditLinkForm from "@/app/_components/organisms/forms/EditLink.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { type LinkType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A link with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update link.",
  default: "An unexpected error occurred. Please try again.",
};

async function editLink(linkData: {
  id: string;
  name: string;
  url: string;
  type: LinkType;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();

    const link = await db.link.update({
      where: {
        id: linkData.id,
        organization_id: user.organization_id,
      },
      data: {
        name: linkData.name,
        url: linkData.url,
        type: linkData.type,
      },
    });

    revalidatePath("/staff/manage/admin/link-list");

    return { success: true, link };
  } catch (error) {
    console.error("Failed to edit link:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getInitialData = async (id: string) => {
  const user = await isAdminOrAbove();

  const link = await db.link.findUniqueOrThrow({
    where: {
      organization_id: user.organization_id,
      id,
    },
  });

  return link;
};

export default async function EditLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Link</h1>
      <EditLinkForm onEdit={editLink} initialData={await getInitialData(id)} />
    </Stack>
  );
}
