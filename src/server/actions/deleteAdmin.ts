"use server";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

export async function deleteAdmin(data: { id: string }) {
  try {
    const user = await getJWTUser();
    if (user.role !== Role.KOKO) throw new Error("Unauthorized");

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
