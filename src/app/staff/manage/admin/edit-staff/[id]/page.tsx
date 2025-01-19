import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { editAdmin } from "@/server/actions/editAdmin";
import EditStaffForm from "@/app/_components/organisms/forms/EditStaff.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";

const getInitialData = async (id: string) => {
  const user = await isAdminOrAbove();

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
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
}
