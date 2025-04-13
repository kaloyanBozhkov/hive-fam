"use server";
import { db } from "@/server/db";
import { isManagerOrAbove } from "../auth/roleGates";

export async function deleteEvent(data: { id: string }) {
  try {
    const user = await isManagerOrAbove();

    await db.event.update({
      where: {
        organization_id: user.organization_id,
        id: data.id,
      },
      data: {
        deleted_at: new Date(),
        is_published: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete staff:", error);
    return { success: false, error };
  }
}
