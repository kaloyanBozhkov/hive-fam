import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import FullScreenEvent from "@/app/_components/organisms/FullScreenEvent.organism";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";

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
  searchParams,
}: {
  params: { id: string };
  searchParams: { as: "view" };
}) {
  const { id } = await (params as unknown as Promise<{ id: string }>);
  const { as } = await (searchParams as unknown as Promise<{ as: "view" }>);
  const event = await getEvent(id);
  if (!event) redirect("/");
  return (
    <>
      <Stack className="m-auto min-h-[400px] max-w-[500px] gap-4">
        <FullScreenEvent event={event} isPast={false} isView={as === "view"} />
        <Button variant="outline">
          <Link href="/">Back To Home</Link>
        </Button>
      </Stack>
    </>
  );
}
