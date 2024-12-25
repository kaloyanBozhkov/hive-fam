"use server";

import { Role, Prisma, type Currency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "This org name is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create org.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

export async function addOrg(orgData: {
  name: string;
  default_currency: Currency;
}) {
  try {
    const user = await getJWTUser();
    if (user.role !== Role.KOKO) throw new Error("Unauthorized");

    await db.organization.create({
      data: orgData,
    });

    revalidatePath("/staff/manage/koko/org-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to add org:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
