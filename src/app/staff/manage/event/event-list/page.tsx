import Stack from "@/app/_components/layouts/Stack.layout";
import { EventList } from "./table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { getEventData } from "@/server/actions/manager/getEventData";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { isManagerOrAbove } from "@/server/auth/roleGates";

export default async function EventListPage() {
  const data = await getEventData();

  const refresh = async () => {
    "use server";
    revalidatePath("/staff/manage/event/event-list");
  };

  return (
    <Stack className="gap-4 p-4 md:p-6">
      <Group className="align-between w-full justify-between">
        <h2 className="text-lg font-semibold md:text-xl">Event List</h2>
        <Button asChild size="sm" className="md:size-default">
          <Link href="/staff/manage/event/add-event">Add Event</Link>
        </Button>
      </Group>
      <EventList
        data={data}
        toggleEventPublished={toggleEventPublished}
        refresh={refresh}
      />
    </Stack>
  );
}

const toggleEventPublished = async (id: string, published: boolean) => {
  "use server";
  await isManagerOrAbove();

  await db.event.update({
    where: { id },
    data: {
      is_published: published,
    },
  });
};
