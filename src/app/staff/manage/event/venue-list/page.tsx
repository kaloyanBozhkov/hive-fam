import Stack from "@/app/_components/layouts/Stack.layout";
import { VenueList } from "./table";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";

export const getVenuesData = async () => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  const data = await db.venue.findMany({
    where: {
      organization_id: user.organization_id,
    },
  });
  return data;
};

export default async function VenueListPage() {
  const data = await getVenuesData();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Venue List</h2>
        <Button asChild>
          <Link href="/staff/manage/event/add-event">Add Venue</Link>
        </Button>
      </Group>
      <VenueList data={data} />
    </Stack>
  );
}
