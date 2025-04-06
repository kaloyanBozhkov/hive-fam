import Stack from "../layouts/Stack.layout";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/app/_components/shadcn/Card.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import Link from "next/link";
import Group from "../layouts/Group.layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { MediaType, type event, type venue } from "@prisma/client";
import Tickets from "./Tickets.organism";
import BuyTickets from "./BuyTickets.organism";
import type { EventTicketType } from "@/utils/types.common";
import { EventInfoCard } from "../molecules/EventInfoCard.molecule";

type Event = event & {
  venue: venue;
  poster_media: {
    bucket_path: string;
    type: MediaType;
  }[];
  ticket_types: EventTicketType[];
};

const FullScreenEvent = ({
  event,
  isPast = false,
  isView = false,
}: {
  event: Event;
  isPast?: boolean;
  isView?: boolean;
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="block">
        <div className="float-left mr-3">
          <EventInfoCard
            eventName={event.title}
            eventDate={event.date}
            eventEndDate={event.end_date}
            eventLocation={event.venue.street_addr}
            eventTimeZone={event.time_zone}
          />
        </div>
      </CardHeader>
      <CardFooter>
        <Stack className="w-full gap-4">
          <Group className="w-full items-center justify-between">
            {event.event_photos_url && isPast && (
              <Link
                href={event.event_photos_url}
                target="_blank"
                className="flex-1"
              >
                <Button className="w-full">View Photos</Button>
              </Link>
            )}
          </Group>
          {!isPast && !isView && (
            <Stack className="mb-2 gap-6">
              <div className="-mx-1 my-1 h-px w-full bg-black/10" />
              <Tickets
                eventId={event.id}
                eventName={event.title}
                ticketTypes={event.ticket_types}
                eventCurrency={event.price_currency}
              />
              <div className="-mx-1 my-1 h-px w-full bg-black/10" />
            </Stack>
          )}
          {!isPast && isView && (
            <BuyTickets
              eventCurrency={event.price_currency}
              isEventFree={event.is_free}
              eventId={event.id}
              eventName={event.title}
              ticketTypes={event.ticket_types}
              eventDate={event.date}
              eventEndDate={event.end_date}
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

export default FullScreenEvent;
