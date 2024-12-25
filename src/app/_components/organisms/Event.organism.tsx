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
import { Fragment, useState } from "react";
import DateCard from "../molecules/DateCard.molecule";
import BuyTickets from "./BuyTickets.organism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { MediaType, type event, type venue } from "@prisma/client";
import TimeCard from "../molecules/TimeCard.molecule";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/_components/shadcn/Carousel.shadcn";
import { S3Service } from "@/utils/s3/service";
import SlideDots from "../atoms/SlideDots.atom";

type Event = event & {
  venue: venue;
  poster_media: {
    bucket_path: string;
    type: MediaType;
  }[];
};

const EventCard = ({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) => {
  const [active, setActive] = useState(0);

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
      {event.poster_media.length > 0 && (
        <CardContent className="clear-both pt-2">
          <Stack className="gap-3">
            <Link href={event.external_event_url ?? "#"} target="_blank">
              <Carousel
                onSlideChanged={setActive}
                currentSlide={active}
                opts={{ duration: 50, loop: true }}
                className="w-full overflow-hidden rounded-md"
              >
                <CarouselContent className="h-full w-full">
                  {event.poster_media.map((media, index) => {
                    const url = S3Service.getFileUrlFromFullPath(
                      media.bucket_path,
                    );
                    return (
                      <CarouselItem key={index} className="h-full">
                        {media.type === MediaType.IMAGE ? (
                          <img
                            src={url}
                            className="h-auto min-h-[150px] w-full bg-loading-img transition-all"
                          />
                        ) : media.type === MediaType.VIDEO ? (
                          <video
                            className="h-auto min-h-[150px] w-full bg-loading-img transition-all"
                            autoPlay
                            loop
                            muted
                            controls
                          >
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[20px] z-10 -xs:hidden" />
                <CarouselNext className="absolute right-[20px] z-10 -xs:hidden" />
              </Carousel>
            </Link>
            <SlideDots
              count={event.poster_media.length}
              active={active}
              onClick={setActive}
              modifier="black"
            />
          </Stack>
        </CardContent>
      )}
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
