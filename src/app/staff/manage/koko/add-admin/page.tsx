import Stack from "@/app/_components/layouts/Stack.layout";
import AddAdminForm from "@/app/_components/organisms/forms/AddAdmin.form";
import { addAdmin } from "@/server/actions/addAdmin";
import { db } from "@/server/db";

const getOrganizations = async () => {
  const organizations = await db.organization.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return organizations;
};

export default async function AddAdmin() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Admin</h1>
      <AddAdminForm onAdd={addAdmin} orgs={await getOrganizations()} />
    </Stack>
  );
}
