"use server";

import { Prisma, Role, type PosterType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "An event with this title already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update event.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

export async function editEvent(eventData: {
  id: string;
  title: string;
  description: string;
  date: Date;
  poster_data_url: string;
  poster_type?: PosterType;
  external_event_url?: string;
  venue_id: string;
  is_published: boolean;
}) {
  try {
    const user = await getJWTUser();
    if (
      !([Role.ADMIN, Role.EVENT_MANAGER, Role.KOKO] as Role[]).includes(
        user.role,
      )
    )
      throw new Error("Unauthorized");

    const event = await db.event.update({
      where: { id: eventData.id, organization_id: user.organization_id },
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        poster_data_url: eventData.poster_data_url,
        poster_type: eventData.poster_type,
        external_event_url: eventData.external_event_url,
        venue_id: eventData.venue_id,
        is_published: eventData.is_published,
      },
    });

    // Revalidate the event list page
    revalidatePath("/staff/manage");

    return { success: true, event };
  } catch (error) {
    console.error("Failed to edit event:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
