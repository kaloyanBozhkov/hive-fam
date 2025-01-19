import { ticket } from "@prisma/client";
import { type FC } from "react";

export const TotalScannedTickets: FC<{
  tickets: ticket[];
  eventDate: Date;
  eventEndDate: Date | null;
}> = ({ tickets, eventDate, eventEndDate }) => {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Tickets scanned starting 4h before event date and ending 4h after
      </h3>
      <p className="mt-2 text-2xl font-bold">
        {getScannedTicketsForEvent({ tickets, eventDate, eventEndDate }).length}
      </p>
    </div>
  );
};

export const getScannedTicketsForEvent = ({
  tickets,
  eventDate,
  eventEndDate,
}: {
  tickets: ticket[];
  eventDate: Date;
  eventEndDate: Date | null;
}) => {
  const RANGE = 60 * 60 * 1000 * 4;
  const countFromMs = eventDate.getTime() - RANGE;
  const countToMs = (eventEndDate?.getTime() ?? new Date().getTime()) + RANGE;
  const scannedTickets = tickets
    .filter((t) => t.scanned_at)
    .filter(
      (t) =>
        t.scanned_at!.getTime() >= countFromMs &&
        t.scanned_at!.getTime() <= countToMs,
    );

  return scannedTickets;
};
