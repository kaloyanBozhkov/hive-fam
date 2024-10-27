"use server";

import { Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

const errorMessages: Record<string, string> = {
  P2002: "A venue with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update venue.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

export async function editVenue(venueData: {
  id: string;
  name: string;
  description: string;
  maps_url: string;
  max_guests: number;
  city: string;
  street_addr: string;
  country: string;
}) {
  try {
    const user = await getJWTUser();
    if (
      !([Role.ADMIN, Role.EVENT_MANAGER, Role.KOKO] as Role[]).includes(
        user.role,
      )
    )
      throw new Error("Unauthorized");

    const venue = await db.venue.update({
      where: { id: venueData.id, organization_id: user.organization_id },
      data: {
        name: venueData.name,
        description: venueData.description,
        maps_url: venueData.maps_url,
        max_guests: venueData.max_guests,
        city: venueData.city,
        street_addr: venueData.street_addr,
        country: venueData.country,
      },
    });

    // Revalidate the venue list page
    revalidatePath("/staff/manage/event/venue-list");

    return { success: true, venue };
  } catch (error) {
    console.error("Failed to edit venue:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}
