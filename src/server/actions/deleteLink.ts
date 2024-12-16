"use server";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

export async function deleteLink(data: { id: string }) {
  try {
    const user = await getJWTUser();
    if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
      throw new Error("Unauthorized");

    await db.link.delete({
      where: {
        organization_id: user.organization_id,
        id: data.id,
      },
    });

    revalidatePath("/staff/manage/admin/link-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error };
  }
}
