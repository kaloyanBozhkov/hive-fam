import Stack from "@/app/_components/layouts/Stack.layout";
import AddAdminForm from "@/app/_components/organisms/forms/AddAdmin.form";
import { isKoko } from "@/server/auth/roleGates";
import { getAllOrgs } from "@/server/actions/org";
import { Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createUser } from "@/server/queries/user/createUser";

const errorMessages: Record<string, string> = {
  P2002: "This email is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create staff member.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function addAdmin(staffData: {
  email: string;
  name: string;
  surname: string;
  role: Role;
  password: string;
  phone: string;
  organization_id: string;
}) {
  "use server";

  try {
    await isKoko();

    const staff = await createUser(staffData);

    // Revalidate the staff list page
    revalidatePath("/staff/manage");

    return { success: true, staff };
  } catch (error) {
    console.error("Failed to add staff:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function AddAdmin() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Admin</h1>
      <AddAdminForm onAdd={addAdmin} orgs={await getAllOrgs()} />
    </Stack>
  );
}
