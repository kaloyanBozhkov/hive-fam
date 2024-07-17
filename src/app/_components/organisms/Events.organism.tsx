import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/shadcn/Tabs.shadcn";
import Center from "../layouts/Center.layour";
import Stack from "../layouts/Stack.layout";

import EVENTS from "@/automated/events.json";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import Link from "next/link";
import Group from "../layouts/Group.layout";
import { Fragment } from "react";
import DateCard from "../molecules/DateCard.molecule";
import { twMerge } from "tailwind-merge";
import BuyTickets from "./BuyTickets.organism";
import { getCoverImgFileNameFromEventTitle } from "@/utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Events = () => {
  const { upcoming, past } = categorizeAndSortEvents(EVENTS);
  return (
    <Stack className="items-center gap-4">
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
              No upcomng events, come back later.
            </p>
          ) : (
            <Stack className="gap-6">
              <EventsList events={upcoming} />
            </Stack>
          )}
        </TabsContent>
        <TabsContent value="past">
          <Stack className="gap-6">
            <EventsList events={past} isPast />
          </Stack>
        </TabsContent>
      </Tabs>
    </Stack>
  );
};

export default Events;

type Event = (typeof EVENTS)[0];

interface CategorizedEvents {
  upcoming: Event[];
  past: Event[];
}

function categorizeAndSortEvents(events: Event[]): CategorizedEvents {
  const eventsParsed = events
    .map((event) => {
      const d = (() => {
        try {
          return new Date(event.date);
        } catch (err) {
          return null;
        }
      })();
      const cover = "-";

      if (!cover) {
        console.warn(`No cover found in covers JSON for event: ${event.title}`);
      }

      return {
        ...event,
        date: d,
      };
    })
    .filter((e) => e.date !== null);

  const eventsSorted = eventsParsed.sort(
    // @TODO Update to TS 5.5. and drop !
    (a, b) => b.date!.getTime() - a.date!.getTime(),
  );
  const rightNow = Date.now();

  return {
    past: eventsSorted
      .filter((e) => e.date!.getTime() < rightNow)
      .map((d) => ({ ...d, date: d.date?.toLocaleDateString() ?? "-" })),
    upcoming: eventsSorted
      .filter((e) => e.date!.getTime() > rightNow)
      .map((d) => ({ ...d, date: d.date?.toLocaleDateString() ?? "-" })),
  };
}

const EventsList = ({
  events,
  isPast = false,
}: {
  events: Event[];
  isPast?: boolean;
}) => {
  return events.map((event, index) => {
    const { date, isGoodDate } = (() => {
      try {
        return {
          date: new Date(event.date),
          isGoodDate: true,
        };
      } catch (err) {
        return {
          date: "-",
          isGoodDate: false,
        };
      }
    })();

    return (
      <Card key={index} className="bg-white">
        <CardHeader className={isGoodDate ? "block" : ""}>
          {isGoodDate && (
            <div className="float-left mr-3">
              <DateCard date={date as Date} />
            </div>
          )}
          <div className={twMerge(isGoodDate ? "!mt-0" : "")}>
            <CardTitle className={twMerge("break-words")}>
              {event.title}
            </CardTitle>
          </div>
          <CardDescription>
            {event.description.split("\n").map((e, idx) => (
              <Fragment key={idx}>
                {e}
                <br />
              </Fragment>
            ))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={event.link} target="_blank">
            <div className="shadow-md">
              <div className="overflow-hidden rounded-md [&:hover_img]:scale-[1.05]">
                {/* eslint-disable-next-line */}
                <img
                  src={`/assets/covers/${getCoverImgFileNameFromEventTitle(event.title)}.png`}
                  className="bg-loading-img h-auto min-h-[150px] w-full transition-all"
                  alt="Cover"
                />
              </div>
            </div>
          </Link>
        </CardContent>
        <CardFooter>
          <Stack className="w-full gap-4">
            <Group className="w-full items-center justify-between">
              {isPast ? null : (
                <p className="font-rex-bold text-[24px]">{event?.price}</p>
              )}
              {event.drivePhotos && event.drivePhotos !== "-" ? (
                <Link
                  href={event.drivePhotos}
                  target="_blank"
                  className="flex-1"
                >
                  <Button className="w-full">View Photos</Button>
                </Link>
              ) : (
                <Link
                  href={event.link}
                  target="_blank"
                  className={isPast ? "flex-1" : ""}
                >
                  <Button
                    variant={isPast ? undefined : "link"}
                    className={twMerge(isPast ? "w-full" : "px-0")}
                  >
                    View Event
                  </Button>
                </Link>
              )}
            </Group>
            {!isPast && <BuyTickets />}
            {!isPast && (
              <Link href={event.location} target="_blank">
                <Button className="w-full shadow-md" variant="secondary">
                  <Group className="items-center gap-[12px]">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>Check Location</span>
                  </Group>
                </Button>
              </Link>
            )}
          </Stack>
        </CardFooter>
      </Card>
    );
  });
};
