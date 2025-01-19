"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isManagerOrAbove } from "../auth/roleGates";

export async function deleteVenue(data: { id: string }) {
  try {
    const user = await isManagerOrAbove();

    await db.venue.delete({
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
