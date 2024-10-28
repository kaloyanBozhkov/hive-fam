import Stack from "@/app/_components/layouts/Stack.layout";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { editAdmin } from "@/server/actions/editAdmin";
import EditStaffForm from "@/app/_components/organisms/forms/EditStaff.form";
const getOrganizations = async () => {
  const organizations = await db.organization.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return organizations;
};

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
    throw new Error("Unauthorized");

  const staff = await db.staff.findUniqueOrThrow({
    where: {
      organization_id: user.organization_id,
      id,
    },
  });

  const { password: _, ...rest } = staff;
  return rest;
};

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Staff</h1>
      <EditStaffForm
        onEdit={editAdmin}
        orgs={await getOrganizations()}
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
}
