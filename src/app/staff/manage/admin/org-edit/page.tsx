import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import EditOrganizationForm from "@/app/_components/organisms/forms/EditOrganization.form";
import { editOrg } from "@/server/actions/editOrg";

const getOrgDetails = async () => {
  const user = await getJWTUser();
  if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
    throw Error("Unauthorized");

  const org = await db.organization.findFirst({
    where: {
      id: user.organization_id,
    },
  });
  return org;
};

export default async function OrgEditPage() {
  const data = await getOrgDetails();
  if (!data) return <p>No organization details found</p>;
  return (
    <Stack className="gap-4">
      <Stack className="align-between w-full justify-between">
        <h2 className="text-md font-semibold">Organization Details</h2>
        <h1 className="text-[22px] font-semibold leading-[120%]">
          {data.name}
        </h1>
      </Stack>
      <Stack className="gap-4">
        <EditOrganizationForm initialData={data} onEdit={editOrg} />
      </Stack>
    </Stack>
  );
}
