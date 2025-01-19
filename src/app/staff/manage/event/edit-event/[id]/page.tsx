import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import EditEventForm from "@/app/_components/organisms/forms/EditEvent.form";
import { getVenuesData } from "@/server/actions/getVenues";
import { getOrgId } from "@/server/actions/org";
import { isManagerOrAbove } from "@/server/auth/roleGates";
import { MediaType, type event as Event } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "An event with this title already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update event.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function editEvent({
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
  "use server";

  try {
    const user = await isManagerOrAbove();

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

const getInitialData = async (id: string) => {
  const user = await isManagerOrAbove();

  const { poster_media, ...event } = await db.event.findUniqueOrThrow({
    where: {
      id,
      organization_id: user.organization_id,
    },
    include: {
      poster_media: {
        select: {
          id: true,
          media: {
            select: {
              bucket_path: true,
              media_type: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return {
    ...event,
    poster_media: poster_media.map((pm, order) => ({
      id: pm.id,
      order,
      bucket_path: pm.media.bucket_path,
      type: pm.media.media_type,
    })),
    external_event_url: event.external_event_url ?? undefined,
  };
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getInitialData(id);
  const orgId = await getOrgId();
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Admin</h1>
      <EditEventForm
        onEdit={editEvent}
        venues={await getVenuesData()}
        initialData={event}
        organizationId={orgId}
      />
    </Stack>
  );
}
