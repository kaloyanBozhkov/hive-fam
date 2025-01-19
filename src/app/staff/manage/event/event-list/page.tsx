import Stack from "@/app/_components/layouts/Stack.layout";
import { EventList } from "./table";
import { db } from "@/server/db";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { isManagerOrAbove } from "@/server/auth/roleGates";

const getData = async () => {
  const user = await isManagerOrAbove();

  const d = await db.event.findMany({
    where: {
      organization_id: user.organization_id,
    },
    include: {
      venue: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return d;
};

export default async function EventListPage() {
  const data = await getData();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Event List</h2>
        <Button asChild>
          <Link href="/staff/manage/event/add-event">Add Event</Link>
        </Button>
      </Group>
      <EventList data={data} />
    </Stack>
  );
}
