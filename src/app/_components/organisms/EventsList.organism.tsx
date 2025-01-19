import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/shadcn/Tabs.shadcn";
import Center from "../layouts/Center.layout";
import Stack from "../layouts/Stack.layout";
import { type MediaType, type event, type venue } from "@prisma/client";
import EventCard from "./Event.organism";
import type { EventTicketType } from "@/utils/types.common";

type Event = event & {
  venue: venue;
  ticket_types: EventTicketType[];
  poster_media: {
    bucket_path: string;
    type: MediaType;
  }[];
};

const Events = ({ events }: { events: Event[] }) => {
  const { upcoming, past } = categorizeAndSortEvents(events);
  return (
    <Stack className="items-center gap-6">
      <h2 className="font-rex-bold text-[22px] leading-[100%] text-white">
        - Our Events -
      </h2>
      <Tabs
        defaultValue={upcoming.length === 0 ? "past" : "upcoming"}
        className="flex w-[420px] max-w-full flex-col gap-4 md:w-[500px]"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger value="upcoming" asChild>
            <Center className="cursor-pointer text-[24px]">
              <h2 className="font-rex-bold leading-[24px]">Upcoming</h2>
            </Center>
          </TabsTrigger>
          <TabsTrigger value="past" asChild>
            <Center className="cursor-pointer text-[24px]">
              <h2 className="font-rex-bold leading-[24px]">Previous</h2>
            </Center>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <p className="text-center font-rex-bold text-[18px] leading-[110%] text-white">
              No upcoming events, come back later.
            </p>
          ) : (
            <Stack className="gap-6">
              <EventsList events={upcoming} />
            </Stack>
          )}
        </TabsContent>
        <TabsContent value="past">
          <Stack className="gap-6">
            {past.length === 0 ? (
              <p className="text-center font-rex-bold text-[18px] leading-[110%] text-white">
                No past events, come back later.
              </p>
            ) : (
              <Stack className="gap-6">
                <EventsList events={past} isPast />
              </Stack>
            )}
          </Stack>
        </TabsContent>
      </Tabs>
    </Stack>
  );
};

export default Events;

interface CategorizedEvents {
  upcoming: Event[];
  past: Event[];
}

function categorizeAndSortEvents(events: Event[]): CategorizedEvents {
  const eventsParsed = events.map((event) => ({
    ...event,
    date: new Date(event.date),
  }));

  const rightNow = Date.now();

  return {
    past: eventsParsed
      .filter((e) => e.date.getTime() < rightNow)
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
    upcoming: eventsParsed
      .filter((e) => e.date.getTime() > rightNow)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  };
}

const EventsList = ({
  events,
  isPast = false,
}: {
  events: Event[];
  isPast?: boolean;
}) => {
  return events.map((event, index) => (
    <EventCard isPast={isPast} event={event} key={index} />
  ));
};
