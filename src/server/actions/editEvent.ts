"use server";

import {
  Prisma,
  Role,
  type event as Event,
  type MediaType,
} from "@prisma/client";
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

export async function editEvent({
  poster_media: latestEventMedia,
  ...eventData
}: Partial<Event> & {
  poster_media: {
    bucket_path: string;
    type: MediaType;
    // event_media id
    id: string;
    order: number;
  }[];
}) {
  try {
    const user = await getJWTUser();
    if (
      !([Role.ADMIN, Role.EVENT_MANAGER, Role.KOKO] as Role[]).includes(
        user.role,
      )
    )
      throw new Error("Unauthorized");

    // delete edent media
    await db.event_media.deleteMany({
      where: {
        event_id: eventData.id,
      },
    });
    const createdMedia = await db.media.createManyAndReturn({
      data: latestEventMedia.map((lm) => ({
        bucket_path: lm.bucket_path,
        media_type: lm.type,
      })),
      select: {
        id: true,
        bucket_path: true,
      },
    });

    const mediaWithOrder = latestEventMedia.map((lm) => ({
      order: lm.order,
      media_id: createdMedia.find((cm) => cm.bucket_path === lm.bucket_path)!
        .id,
    }));

    const event = await db.event.update({
      where: { id: eventData.id, organization_id: user.organization_id },
      data: {
        ...eventData,
        poster_media: {
          createMany: {
            data: mediaWithOrder,
          },
        },
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
