"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isKoko } from "../auth/roleGates";

export async function deleteOrg(data: { id: string }) {
  try {
    await isKoko();

    await db.organization.delete({
      where: {
        id: data.id,
      },
    });

    revalidatePath("/staff/manage/koko/org-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete org:", error);
    return { success: false, error };
  }
}
