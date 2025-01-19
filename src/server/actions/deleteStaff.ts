"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isAdminOrAbove } from "../auth/roleGates";

export async function deleteStaff(data: { id: string }) {
  try {
    const user = await isAdminOrAbove();

    await db.staff.delete({
      where: {
        organization_id: user.organization_id,
        id: data.id,
      },
    });

    revalidatePath("/staff/manage");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete staff:", error);
    return { success: false, error };
  }
}
