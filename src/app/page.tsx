import Stack from "@/app/_components/layouts/Stack.layout";

import EventsList from "@/app/_components/organisms/EventsList.organism";
import LandingBanner from "@/app/_components/molecules/LandingBanner.molecule";
import { db } from "@/server/db";
import { getOrgId } from "@/server/actions/org";

const getEvents = async (orgId: string) => {
  const events = await db.event.findMany({
    include: {
      venue: true,
    },
    where: {
      is_published: true,
      organization_id: orgId,
    },
  });
  return events;
};

export default async function Home() {
  const orgId = await getOrgId();

  return (
    <>
      <div className="full-width mb-4 h-[420px] overflow-hidden border-y-[1px] border-white sm:h-[600px]">
        <LandingBanner />
      </div>
      <Stack className="mt-2 min-h-[400px] gap-4">
        <EventsList events={await getEvents(orgId)} />
      </Stack>
    </>
  );
}
