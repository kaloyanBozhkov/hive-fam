"use client";

import { twMerge } from "tailwind-merge";
import { Button } from "../shadcn/Button.shadcn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Group from "../layouts/Group.layout";
import { faCreditCard, faTicket } from "@fortawesome/free-solid-svg-icons";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/shadcn/Dialog.shadcn";
import Tickets from "./Tickets.organism";
import type { Currency } from "@prisma/client";
import FreeTickets from "./FreeTickets.organism";
import type { EventTicketType } from "@/utils/types.common";
import { EventInfoCard } from "../molecules/EventInfoCard.molecule";

const BuyTickets = ({
  className = "",
  eventId,
  eventName,
  ticketTypes,
  isEventFree,
  eventCurrency,
  eventDate,
  eventLocation,
  eventEndDate,
  eventTimeZone,
  isModalMode = false,
}: {
  className?: string;
  eventId: string;
  eventName: string;
  ticketTypes: EventTicketType[];
  isEventFree: boolean;
  eventCurrency: Currency;
  eventDate: Date;
  eventLocation?: string;
  eventEndDate?: Date | null;
  eventTimeZone?: string | null;
  isModalMode?: boolean;
}) => {
  return (
    <div className={twMerge("w-full", className)}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            {isEventFree ? (
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faTicket} />
                <span>Get Tickets</span>
              </Group>
            ) : (
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Buy Tickets</span>
              </Group>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg -sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              <EventInfoCard
                className="mb-4"
                eventName={eventName}
                eventDate={eventDate}
                eventLocation={eventLocation}
                eventEndDate={eventEndDate}
                eventTimeZone={eventTimeZone}
              />
            </DialogTitle>
            {isEventFree ? (
              // TODO free tickets of different types
              <FreeTickets eventId={eventId} eventName={eventName} />
            ) : (
              <Tickets
                isModalMode={isModalMode}
                eventId={eventId}
                eventName={eventName}
                ticketTypes={ticketTypes}
                eventCurrency={eventCurrency}
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyTickets;
