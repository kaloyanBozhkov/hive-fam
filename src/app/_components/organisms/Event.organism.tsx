import Stack from "../layouts/Stack.layout";
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
import BuyTickets from "./BuyTickets.organism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { type event, type venue } from "@prisma/client";
import TimeCard from "../molecules/TimeCard.molecule";

type Event = event & {
  venue: venue;
};

const EventCard = ({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="block">
        <div className="float-left mr-3">
          <Stack className="gap-2">
            <DateCard date={new Date(event.date)} />
            <TimeCard date={new Date(event.date)} />
          </Stack>
        </div>
        <div className="!mt-0">
          <Link href={`/event/${event.id}`}>
            <CardTitle className="break-words hover:opacity-75">
              {event.title}
            </CardTitle>
          </Link>
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
      <CardContent className="clear-both pt-2">
        <Link href={event.external_event_url ?? "#"} target="_blank">
          <div className="shadow-md">
            <div className="overflow-hidden rounded-md [&:hover_img]:scale-[1.05]">
              <img
                src={event.poster_data_url}
                className="h-auto min-h-[150px] w-full bg-loading-img transition-all"
                alt="Cover"
              />
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter>
        <Stack className="w-full gap-4">
          <Group className="w-full items-center justify-between">
            {event.event_photos_url && (
              <Link
                href={event.event_photos_url}
                target="_blank"
                className="flex-1"
              >
                <Button className="w-full">View Photos</Button>
              </Link>
            )}
          </Group>
          {!isPast && (
            <BuyTickets
              eventId={event.id}
              eventName={event.title}
              eventPrice={event.ticket_price}
              eventCurrency={event.price_currency}
            />
          )}
          {!isPast && (
            <Button className="w-full shadow-md" variant="secondary" asChild>
              <Link href={event.venue.maps_url} target="_blank">
                <Group className="items-center gap-[12px]">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>Check Location</span>
                </Group>
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary" className="shadow-md">
            <Link
              href={event.external_event_url ?? "#"}
              target="_blank"
              className={isPast ? "flex-1" : ""}
            >
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faNoteSticky} />
                <span> View Event</span>
              </Group>
            </Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
