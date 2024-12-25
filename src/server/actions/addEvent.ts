"use server";
import { type Currency, type MediaType, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getJWTUser } from "../auth/getJWTUser";
import { db } from "@/server/db";

type EventData = {
  title: string;
  description: string;
  date: Date;
  poster_media: { bucket_path: string; type: MediaType }[];
  external_event_url?: string | null;
  venue_id: string;
  ticket_price: number;
  price_currency: Currency;
};

export async function addEvent({ poster_media, ...data }: EventData) {
  try {
    const user = await getJWTUser();
    if (
      !([Role.ADMIN, Role.EVENT_MANAGER, Role.KOKO] as Role[]).includes(
        user.role,
      )
    )
      throw new Error("Unauthorized");

    await db.media.createMany({
      data: poster_media.map((media) => ({
        bucket_path: media.bucket_path,
        media_type: media.type,
      })),
    });

    const mediaIds = await db.media.findMany({
      where: {
        bucket_path: {
          in: poster_media.map(({ bucket_path }) => bucket_path),
        },
      },
      select: {
        id: true,
        bucket_path: true,
      },
    });

    const event = await db.event.create({
      data: {
        ...data,
        organization_id: user.organization_id,
        poster_media: {
          createMany: {
            data: poster_media.map((posterMedia, order) => ({
              order,
              media_id: mediaIds.find(
                (media) => posterMedia.bucket_path === media.bucket_path,
              )!.id,
            })),
          },
        },
      },
    });

    revalidatePath("/staff/manage");

    return { success: true, event };
  } catch (error) {
    console.error("Failed to add event:", error);
    return { success: false, error: "Failed to add event" };
  }
}
