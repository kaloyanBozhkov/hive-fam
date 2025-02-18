import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import EditOrganizationForm from "@/app/_components/organisms/forms/EditOrganization.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { Prisma, type organization as Organization } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "An organization with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update organization.",
  default: "An unexpected error occurred. Please try again.",
};

async function editOrg(orgData: Partial<Organization>) {
  "use server";

  try {
    await isAdminOrAbove();

    await db.organization.update({
      where: { id: orgData.id },
      data: orgData,
    });

    revalidatePath("/staff/manage/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to edit organization:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getOrgDetails = async () => {
  const user = await isAdminOrAbove();

  const org = await db.organization.findFirst({
    where: {
      id: user.organization_id,
    },
  });
  return org;
};

export default async function OrgEditPage() {
  const data = await getOrgDetails();
  console.log(data);
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
        <EditOrganizationForm
          initialData={data}
          onEdit={editOrg}
          orgId={data.id}
        />
      </Stack>
    </Stack>
  );
}
