"use server";

import { type Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { updateUser } from "../queries/user/updateUser";
import { encryptPassword } from "../queries/user/createUser";
import { isAdminOrAbove } from "../auth/roleGates";

const errorMessages: Record<string, string> = {
  P2002: "This email is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create staff member.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

export async function editAdmin(staffData: {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: Role;
  password?: string;
  phone: string;
}) {
  try {
    await isAdminOrAbove();

    const staff = await updateUser({
      ...staffData,
      password:
        staffData.password && (await encryptPassword(staffData.password)),
    });

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
