import Stack from "@/app/_components/layouts/Stack.layout";
import { ProfitsList } from "./table";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import Group from "@/app/_components/layouts/Group.layout";

const getEvents = async () => {
  const user = await getJWTUser();
  if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
    throw Error("Unauthorized");

  const events = await db.event.findMany({
    where: {
      organization_id: user.organization_id,
    },
    select: {
      id: true,
      title: true,
      sold_tickets: {
        select: {
          price: true,
          currency: true,
          scanned: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return events;
};

export default async function ProfitsPage() {
  const data = await getEvents();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Your Earnings</h2>
      </Group>
      <ProfitsList events={data} />
    </Stack>
  );
}
