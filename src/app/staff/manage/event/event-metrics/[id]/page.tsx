import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { isManagerOrAbove } from "@/server/auth/roleGates";
import { DateVisualizer } from "@/app/_components/data/DateVisualizer";
import Group from "@/app/_components/layouts/Group.layout";
import {
  getScannedTicketsForEvent,
  TotalScannedTickets,
} from "@/app/_components/molecules/TotalScannedTickets.molecule";
import { formatDateToTimezone } from "@/utils/fe";

const getInitialData = async (id: string) => {
  const user = await isManagerOrAbove();

  const event = await db.event.findFirstOrThrow({
    where: {
      id,
      ...(user.role === "KOKO"
        ? {}
        : {
            organization_id: user.organization_id,
          }),
    },
  });

  const sold_tickets = await db.ticket.findMany({
    where: {
      event_id: id,
      ...(user.role === "KOKO"
        ? {}
        : {
            event: {
              organization_id: user.organization_id,
            },
          }),
    },
  });

  return {
    event,
    sold_tickets,
  };
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { event, sold_tickets } = await getInitialData(id);
  const scannedTickets = getScannedTicketsForEvent({
    tickets: sold_tickets,
    eventDate: event.date,
    eventEndDate: event.end_date,
  });

  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">
        Event Metrics
      </h1>

      <h1 className="text-[18px] leading-[100%]">{event.title}</h1>

      <Group className="gap-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Tickets {event.is_free ? "Claimed" : "Sold"}
          </h3>
          <p className="mt-2 text-2xl font-bold">{sold_tickets.length}</p>
        </div>
        <TotalScannedTickets
          tickets={sold_tickets}
          eventDate={formatDateToTimezone(event.date, event.time_zone)}
          eventEndDate={
            event.end_date
              ? formatDateToTimezone(event.end_date, event.time_zone)
              : null
          }
        />
      </Group>

      <div className="h-[400px] w-full">
        <DateVisualizer
          timestamps={scannedTickets.map((t) =>
            formatDateToTimezone(t.scanned_at!, event.time_zone)!.toISOString(),
          )} // Use batched tickets here
        />
      </div>
    </Stack>
  );
}
