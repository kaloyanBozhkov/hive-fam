import Stack from "@/app/_components/layouts/Stack.layout";
import { EventList } from "./table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { getEventData } from "@/server/actions/manager/getEventData";

export default async function EventListPage() {
  const data = await getEventData();
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
