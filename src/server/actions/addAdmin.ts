"use server";

import { Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createUser } from "../queries/user/createUser";
import { getJWTUser } from "../auth/getJWTUser";

const errorMessages: Record<string, string> = {
  P2002: "This email is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create staff member.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

export async function addAdmin(staffData: {
  email: string;
  name: string;
  surname: string;
  role: Role;
  password: string;
  phone: string;
  organization_id: string;
}) {
  try {
    const user = await getJWTUser();
    if (user.role !== Role.KOKO) throw new Error("Unauthorized");

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
