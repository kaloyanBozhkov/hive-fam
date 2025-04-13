"use client";

import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
import Stack from "@/app/_components/layouts/Stack.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/Select.shadcn";
import { getEventEarnings } from "@/server/queries/invoice/getEventEarnings";
import Link from "next/link";
import { Suspense, useLayoutEffect, useState, useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();
  const [earnings, setEarnings] = useState<
    { currency: string; total: number }[]
  >([]);
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  useLayoutEffect(() => {
    startTransition(async () => {
      const newEarnings = await getEventEarnings(selectedEventId);
      setEarnings(newEarnings);
    });
  }, [selectedEventId]);

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
        <Stack className="gap-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Revenue
              </h3>
              <div className="mt-2">
                {isPending ? (
                  <DotsLoader modifier="secondary" />
                ) : (
                  <Stack className="gap-2">
                    {earnings.map(({ currency, total }) => (
                      <p className="text-2xl font-bold" key={currency}>
                        {currency}: {total}
                      </p>
                    ))}
                  </Stack>
                )}
              </div>
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
          <Link href={`/staff/manage/event/event-metrics/${selectedEvent.id}`}>
            <Button variant="default" className="mt-2">
              View Details
            </Button>
          </Link>
        </Stack>
      )}
    </Stack>
  );
};
