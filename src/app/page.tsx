import Stack from "@/app/_components/layouts/Stack.layout";

import EventsList from "@/app/_components/organisms/EventsList.organism";
import LandingBanner from "@/app/_components/molecules/LandingBanner.molecule";
import { db } from "@/server/db";

const getEvents = async () => {
  const events = await db.event.findMany({
    include: {
      venue: true,
    },
  });
  return events;
};

export default async function Home() {
  return (
    <>
      <div className="full-width mb-4 h-[420px] overflow-hidden border-y-[1px] border-white sm:h-[600px]">
        <LandingBanner />
      </div>
      <Stack className="min-h-[400px] gap-4">
        <EventsList events={await getEvents()} />
      </Stack>
    </>
  );
}
