import Stack from "@/app/_components/layouts/Stack.layout";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import EditVenueForm from "@/app/_components/organisms/forms/EditVenue.form";
import { editVenue } from "@/server/actions/editVenue";

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  const venue = await db.venue.findUniqueOrThrow({
    where: {
      id,
      organization_id: user.organization_id,
    },
  });
  return venue;
};

export default async function EditVenuePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Admin</h1>
      <EditVenueForm
        onEdit={editVenue}
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
}
