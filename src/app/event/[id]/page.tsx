import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import FullScreenEvent from "@/app/_components/organisms/FullScreenEvent.organism";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import { isPastEvent } from "@/utils/specific";

const getEvent = async (id: string) => {
  const { poster_media, ...event } = await db.event.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      venue: true,
      poster_media: {
        select: {
          order: true,
          media: {
            select: {
              bucket_path: true,
              media_type: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return {
    poster_media: poster_media.map((pm) => ({
      bucket_path: pm.media.bucket_path,
      type: pm.media.media_type,
    })),
    ...event,
  };
};

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ as: "view" }>;
}) {
  const { id } = await params;
  const { as } = await searchParams;

  let event: Awaited<ReturnType<typeof getEvent>>;

  try {
    event = await getEvent(id);
  } catch (err) {
    console.warn(err);
    redirect("/");
    return;
  }

  if (!event || isPastEvent(event)) redirect("/");

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
