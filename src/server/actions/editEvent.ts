"use server";

import { Prisma, Role, event as Event } from "@prisma/client";
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

export async function editEvent(eventData: Partial<Event>) {
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
      data: eventData,
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
