"use client";

import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/Select.shadcn";
import { useState } from "react";

type Event = {
  id: string;
  title: string;
  sold_tickets: {
    price: number;
    currency: string;
    scanned: boolean;
    is_free: boolean;
  }[];
};

export const ProfitsList = ({ events }: { events: Event[] }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id ?? "",
  );
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  if (events.length === 0) {
    return (
      <div className="text-left text-muted-foreground">
        No events found. Create an event and sell some tickets to see earnings
        here.
      </div>
    );
  }

  const freeTickets = selectedEvent?.sold_tickets.filter((t) => t.is_free);
  const paidTickets = selectedEvent?.sold_tickets.filter((t) => !t.is_free);
  const totalFreeTickets = freeTickets?.length ?? 0;
  const totalPaidTickets = paidTickets?.length ?? 0;
  const scannedFreeTickets =
    freeTickets?.filter((ticket) => ticket.scanned).length ?? 0;
  const scannedSoldTickets =
    paidTickets?.filter((ticket) => ticket.scanned).length ?? 0;

  // TODO totalRevenue
  const totalRevenue =
    paidTickets?.reduce((acc, ticket) => {
      return acc + ticket.price;
    }, 0) ?? 0;

  const currency = paidTickets?.[0]?.currency ?? "USD";

  return (
    <Stack className="gap-6">
      <Stack className="gap-1.5">
        <p className="text-sm font-medium text-muted-foreground">
          Select an event to view statistics
        </p>
        <Select value={selectedEventId} onChange={setSelectedEventId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Stack>

      {selectedEvent && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </h3>
            <p className="mt-2 text-2xl font-bold">
              {totalRevenue.toLocaleString(undefined, {
                style: "currency",
                currency,
              })}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Tickets Sold
            </h3>
            <p className="mt-2 text-2xl font-bold">{totalPaidTickets}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Free Tickets
            </h3>
            <p className="mt-2 text-2xl font-bold">{totalFreeTickets}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Scanned Tickets
            </h3>
            <p className="mt-2 text-2xl font-bold">
              {scannedSoldTickets + scannedFreeTickets}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Scanned Paid Tickets
            </h3>
            <p className="mt-2 text-2xl font-bold">{scannedSoldTickets}</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Scanned Free Tickets
            </h3>
            <p className="mt-2 text-2xl font-bold">{scannedFreeTickets}</p>
          </div>
        </div>
      )}
    </Stack>
  );
};
