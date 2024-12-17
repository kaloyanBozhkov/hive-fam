"use client";

import { twMerge } from "tailwind-merge";
import { Button } from "../shadcn/Button.shadcn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Group from "../layouts/Group.layout";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/shadcn/Dialog.shadcn";
import Tickets from "./Tickets.organism";
import type { Currency } from "@prisma/client";

const BuyTickets = ({
  className = "",
  eventId,
  eventName,
  eventPrice,
  eventCurrency,
}: {
  className?: string;
  eventId: string;
  eventName: string;
  eventPrice: number;
  eventCurrency: Currency;
}) => {
  return (
    <div className={twMerge("w-full", className)}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Group className="items-center gap-[12px]">
              <FontAwesomeIcon icon={faCreditCard} />
              <span>Buy Tickets</span>
            </Group>
          </Button>
        </DialogTrigger>
        <DialogContent className="-sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-left">Choose tickets</DialogTitle>
            <DialogDescription></DialogDescription>
            <Tickets
              eventId={eventId}
              eventPrice={eventPrice}
              eventName={eventName}
              eventCurrency={eventCurrency}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyTickets;
