"use client";
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
import { Fragment, useEffect, useState } from "react";
import DateCard from "../molecules/DateCard.molecule";
import BuyTickets from "./BuyTickets.organism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { type event, type venue } from "@prisma/client";
import TimeCard from "../molecules/TimeCard.molecule";
import Tickets from "./Tickets.organism";

type Event = event & {
  venue: venue;
};

const MAX_DESC_LENGTH = 100;

const FullScreenEvent = ({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [desc, setDesc] = useState(event.description.slice(0, MAX_DESC_LENGTH));
  const toggleShowMore = (
    <Button
      className="inline px-0"
      variant="link"
      onClick={() => setShowMore((prev) => !prev)}
    >
      Show {showMore ? "Less" : "More"}
    </Button>
  );
  const description = (
    <CardDescription>
      {desc.split("\n").map((e, idx) => (
        <Fragment key={idx}>
          {e}
          {idx !== desc.split("\n").length - 1 && <br />}
        </Fragment>
      ))}{" "}
      {!showMore && toggleShowMore}
    </CardDescription>
  );
  const visualContent = (
    <CardContent className="clear-both">
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
      {showMore && <div className="mt-2">{toggleShowMore}</div>}
    </CardContent>
  );

  useEffect(() => {
    setDesc(
      showMore
        ? event.description
        : `${event.description.slice(0, MAX_DESC_LENGTH)}...`,
    );
  }, [showMore]);

  return (
    <Card className="bg-white">
      <CardHeader className="block">
        <div className="float-left mb-2 mr-3">
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
        {description}
      </CardHeader>
      {showMore && visualContent}
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
            <Stack className="mb-2 gap-6">
              <div className="-mx-1 my-1 h-px w-full bg-black/10" />
              <Tickets
                eventPrice={event.ticket_price}
                eventName={event.title}
                eventCurrency={event.price_currency}
              />
              <div className="-mx-1 my-1 h-px w-full bg-black/10" />
            </Stack>
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

export default FullScreenEvent;
