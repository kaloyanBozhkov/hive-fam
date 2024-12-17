"use server";

import { type LinkType, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "A link with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create link.",
  default: "An unexpected error occurred. Please try again.",
};

export async function addLink(linkData: {
  name: string;
  url: string;
  type: LinkType;
}) {
  try {
    const user = await getJWTUser();
    if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    const link = await db.link.create({
      data: {
        ...linkData,
        organization: {
          connect: {
            id: user.organization_id,
          },
        },
      },
    });

    revalidatePath("/staff/manage/admin/link-list");

    return { success: true, link };
  } catch (error) {
    console.error("Failed to add link:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
