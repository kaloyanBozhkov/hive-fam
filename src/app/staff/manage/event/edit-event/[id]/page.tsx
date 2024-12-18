import Stack from "@/app/_components/layouts/Stack.layout";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import EditEventForm from "@/app/_components/organisms/forms/EditEvent.form";
import { editEvent } from "@/server/actions/editEvent";
import { getVenuesData } from "@/server/actions/getVenues";

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  const event = await db.event.findUniqueOrThrow({
    where: {
      id,
      organization_id: user.organization_id,
    },
  });

  return {
    ...event,
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
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Admin</h1>
      <EditEventForm
        onEdit={editEvent}
        venues={await getVenuesData()}
        initialData={event}
      />
    </Stack>
  );
}
