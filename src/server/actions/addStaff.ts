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

export async function addStaff(staffData: {
  email: string;
  name: string;
  surname: string;
  role: Role;
  password: string;
  phone: string;
}) {
  try {
    const user = await getJWTUser();
    const staff = await createUser({
      ...staffData,
      // can only add to own organization
      organization_id: user.organization_id,
    });

    revalidatePath("/staff/manage");

    return { success: true, staff };
  } catch (error) {
    console.error("Failed to add staff:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] || errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
