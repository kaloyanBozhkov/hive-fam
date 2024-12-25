import Stack from "@/app/_components/layouts/Stack.layout";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import EditEventForm from "@/app/_components/organisms/forms/EditEvent.form";
import { editEvent } from "@/server/actions/editEvent";
import { getVenuesData } from "@/server/actions/getVenues";
import { getOrgId } from "@/server/actions/org";

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

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
