"use server";

import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "An organization with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update organization.",
  default: "An unexpected error occurred. Please try again.",
};

export async function editOrg(orgData: {
  id: string;
  name: string;
  description?: string | null;
  brand_logo_data_url?: string | null;
  display_name?: string | null;
  favicon_data_url?: string | null;
}) {
  try {
    const user = await getJWTUser();
    if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

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
