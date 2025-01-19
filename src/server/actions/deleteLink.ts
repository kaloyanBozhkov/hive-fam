"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isAdminOrAbove } from "../auth/roleGates";

export async function deleteLink(data: { id: string }) {
  try {
    const user = await isAdminOrAbove();

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
