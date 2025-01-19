import Stack from "@/app/_components/layouts/Stack.layout";
import { ProfitsList } from "./table";
import { db } from "@/server/db";
import Group from "@/app/_components/layouts/Group.layout";
import { isAdminOrAbove } from "@/server/auth/roleGates";

const getEvents = async () => {
  const user = await isAdminOrAbove();

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
          is_free: true,
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
