import Stack from "@/app/_components/layouts/Stack.layout";
import AddEventForm from "@/app/_components/organisms/forms/AddEvent.form";
import { getOrg, getOrgId } from "@/server/actions/org";
import { isManagerOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { Currency, type MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";

type EventData = {
  title: string;
  description: string;
  date: Date;
  poster_media: { bucket_path: string; type: MediaType }[];
  external_event_url?: string | null;
  venue_id: string;
  ticket_price?: number;
  price_currency: Currency;
  is_free: boolean;
};

async function addEvent({ poster_media, ...data }: EventData) {
  "use server";

  try {
    const user = await isManagerOrAbove();

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

const getVenues = async () => {
  const user = await isManagerOrAbove();
  const venues = await db.venue.findMany({
    where: {
      organization_id: user.organization_id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const defaultCurrency = (await getOrg())?.default_currency ?? Currency.EUR;
  return { venues, defaultCurrency };
};

export default async function AddEvent() {
  const { venues, defaultCurrency } = (await getVenues()) ?? {};
  const orgId = await getOrgId();
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Event</h1>
      <AddEventForm
        onAdd={addEvent}
        venues={venues}
        defaultCurrency={defaultCurrency}
        organizationId={orgId}
      />
    </Stack>
  );
}
