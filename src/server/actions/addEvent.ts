"use server";
import { type PosterType, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

type EventData = {
  title: string;
  description: string;
  date: Date;
  poster_data_url: string;
  poster_type: PosterType;
  external_event_url?: string | null;
  venue_id: string;
};

export async function addEvent(data: EventData) {
  try {
    const user = await getJWTUser();
    if (
      !([Role.ADMIN, Role.EVENT_MANAGER, Role.KOKO] as Role[]).includes(
        user.role,
      )
    )
      throw new Error("Unauthorized");

    const event = await db.event.create({
      data: {
        ...data,
        organization_id: user.organization_id,
      },
    });

    revalidatePath("/staff/manage");

    return { success: true, event };
  } catch (error) {
    console.error("Failed to add event:", error);
    return { success: false, error: "Failed to add event" };
  }
}
