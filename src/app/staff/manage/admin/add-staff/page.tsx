import AddStaffForm from "@/app/_components/organisms/forms/AddStaff.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { createUser } from "@/server/queries/user/createUser";
import { Prisma, type Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "This email is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create staff member.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function addStaff(staffData: {
  email: string;
  name: string;
  surname: string;
  role: Role;
  password: string;
  phone: string;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();

    const staff = await createUser({
      ...staffData,
      // can only add to own organization
      organization_id: user.organization_id,
      is_org_owner: false,
    });

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

export default async function AddStaff() {
  return <AddStaffForm onAdd={addStaff} />;
}
