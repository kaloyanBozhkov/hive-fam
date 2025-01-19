import Stack from "@/app/_components/layouts/Stack.layout";
import EditAdminForm from "@/app/_components/organisms/forms/EditAdmin.form";
import { db } from "@/server/db";
import { editAdmin } from "@/server/actions/editAdmin";
import { isKoko } from "@/server/auth/roleGates";
import { getAllOrgs } from "@/server/actions/org";

const getInitialData = async (id: string) => {
  await isKoko();
  const staff = await db.staff.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const { password: _, ...rest } = staff;
  return rest;
};

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Admin</h1>
      <EditAdminForm
        onEdit={editAdmin}
        orgs={await getAllOrgs()}
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
}
