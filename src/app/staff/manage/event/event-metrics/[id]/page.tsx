import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import { isAdminOrAbove, isManagerOrAbove } from "@/server/auth/roleGates";
import { DateVisualizer } from "@/app/_components/data/DateVisualizer";
import Group from "@/app/_components/layouts/Group.layout";
import {
  getScannedTicketsForEvent,
  TotalScannedTickets,
} from "@/app/_components/molecules/TotalScannedTickets.molecule";
import { formatDateToTimezone } from "@/utils/fe";
import getInvoices from "@/server/queries/invoice/getInvoices";
import { InvoiceList } from "./invoice-list/table";
import { Suspense } from "react";
import { getEventEarnings } from "@/server/queries/invoice/getEventEarnings";

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
        <TotalScannedTickets totalScannedTickets={scannedTickets.length} />
      </Group>
      <div className="flex h-[400px] w-full flex-col gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Scanned Tickets Over Time
        </h3>
        <DateVisualizer
          timestamps={scannedTickets.map((t) =>
            formatDateToTimezone(t.scanned_at!, event.time_zone).toISOString(),
          )} // Use batched tickets here
        />
      </div>
      <Suspense>{getAdminMetrics(event.id)}</Suspense>
    </Stack>
  );
}

const getAdminMetrics = async (eventId: string) => {
  "use server";

  const isAdmin = await isAdminOrAbove();
  if (!isAdmin) {
    return null;
  }

  const invoices = await getInvoices({ eventId });

  return (
    <Stack className="gap-2">
      {(await getEventEarnings(eventId, invoices)).map(
        ({ currency, total }) => (
          <h3
            key={currency}
            className="text-sm font-medium text-muted-foreground"
          >
            Total ({currency}): {total.toFixed(2)}
          </h3>
        ),
      )}
      <InvoiceList data={invoices} />
    </Stack>
  );
};
