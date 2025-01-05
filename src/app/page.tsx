import Stack from "@/app/_components/layouts/Stack.layout";

import EventsList from "@/app/_components/organisms/EventsList.organism";
import LandingBanner from "@/app/_components/molecules/LandingBanner.molecule";
import { db } from "@/server/db";
import { getOrgId } from "@/server/actions/org";

const getEvents = async (orgId: string) => {
  const events = await db.event.findMany({
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
    where: {
      is_published: true,
      organization_id: orgId,
    },
  });

  return events.map(({ poster_media, ...event }) => ({
    ...event,
    poster_media: poster_media.map((pm) => ({
      bucket_path: pm.media.bucket_path,
      type: pm.media.media_type,
    })),
  }));
};

export default async function Home() {
  const orgId = await getOrgId();

  return (
    <>
      <div className="full-width mb-4 h-[420px] overflow-hidden border-y-[1px] border-white sm:h-[600px]">
        <LandingBanner />
      </div>
      <Stack className="mt-2 min-h-[400px] gap-4 px-[10px]">
        <EventsList events={await getEvents(orgId)} />
      </Stack>
    </>
  );
}
