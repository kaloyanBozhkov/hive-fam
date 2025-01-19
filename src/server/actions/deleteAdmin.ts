"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isKoko } from "../auth/roleGates";

export async function deleteAdmin(data: { id: string }) {
  try {
    await isKoko();

    await db.staff.delete({
      where: {
        id: data.id,
      },
    });

    revalidatePath("/staff/manage/koko/admin-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete admin:", error);
    return { success: false, error };
  }
}
