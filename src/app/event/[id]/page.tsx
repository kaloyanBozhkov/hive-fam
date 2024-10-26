import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import FullScreenEvent from "@/app/_components/organisms/FullScreenEvent.organism";

const getEvent = async (id: string) => {
  const event = await db.event.findFirst({
    where: {
      id,
    },
    include: {
      venue: true,
    },
  });
  return event;
};

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await (params as unknown as Promise<{ id: string }>);
  const event = await getEvent(id);
  if (!event) redirect("/");
  return (
    <>
      <Stack className="m-auto min-h-[400px] max-w-[500px] gap-4">
        <FullScreenEvent event={event} isPast={false} />
      </Stack>
    </>
  );
}
