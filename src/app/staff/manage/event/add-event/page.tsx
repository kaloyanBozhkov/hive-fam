import Stack from "@/app/_components/layouts/Stack.layout";
import AddEventForm from "@/app/_components/organisms/forms/AddEvent.form";
import { addEvent } from "@/server/actions/addEvent";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

const getVenues = async () => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  const venues = await db.venue.findMany({
    where: {
      organization_id: user.organization_id,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return venues;
};

export default async function AddEvent() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Event</h1>
      <AddEventForm onAdd={addEvent} venues={await getVenues()} />
    </Stack>
  );
}
