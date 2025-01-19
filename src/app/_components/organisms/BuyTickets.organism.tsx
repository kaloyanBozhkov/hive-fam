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
import type { Currency, event_ticket_type } from "@prisma/client";
import FreeTickets from "./FreeTickets.organism";

const BuyTickets = ({
  className = "",
  eventId,
  eventName,
  ticketTypes,
  isEventFree,
  eventCurrency,
}: {
  className?: string;
  eventId: string;
  eventName: string;
  ticketTypes: event_ticket_type[];
  isEventFree: boolean;
  eventCurrency: Currency;
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
            <DialogTitle className="text-left">Get Your Tickets</DialogTitle>
            {isEventFree ? (
              // TODO free tickets of different types
              <FreeTickets eventId={eventId} eventName={eventName} />
            ) : (
              <Tickets
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
