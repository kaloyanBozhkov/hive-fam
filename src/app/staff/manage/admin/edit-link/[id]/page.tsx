import Stack from "@/app/_components/layouts/Stack.layout";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { editLink } from "@/server/actions/editLink";
import EditLinkForm from "@/app/_components/organisms/forms/EditLink.form";

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
    throw new Error("Unauthorized");

  const link = await db.link.findUniqueOrThrow({
    where: {
      organizationId: user.organization_id,
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
