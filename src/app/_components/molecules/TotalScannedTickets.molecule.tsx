import { ticket } from "@prisma/client";
import { FC } from "react";

export const TotalScannedTickets: FC<{
  tickets: ticket[];
  eventDate: Date;
}> = ({ tickets, eventDate }) => {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Total Tickets Scanned 12hr before & after event starting time
      </h3>
      <p className="mt-2 text-2xl font-bold">
        {getScannedTicketsForEvent({ tickets, eventDate }).length}
      </p>
    </div>
  );
};

export const getScannedTicketsForEvent = ({
  tickets,
  eventDate,
}: {
  tickets: ticket[];
  eventDate: Date;
}) => {
  const RANGE = 60 * 60 * 1000 * 12;
  const countFromMs = eventDate.getTime() - RANGE;
  const countToMs = eventDate.getTime() + RANGE;
  const scannedTickets = tickets
    .filter((t) => t.scanned_at)
    .filter(
      (t) =>
        t.scanned_at!.getTime() >= countFromMs &&
        t.scanned_at!.getTime() <= countToMs,
    );

  return scannedTickets;
};
