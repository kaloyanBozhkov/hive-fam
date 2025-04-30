import Stack from "@/app/_components/layouts/Stack.layout";
import { EventSoldTicketsTable } from "./table";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EventSoldTicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id, deleted_at: null },
    include: {
      sold_tickets: {
        include: {
          owner: true,
          ticket_type: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
      ticket_types: true,
    },
  });

  if (!event) {
    notFound();
  }

  const deleteTicket = async (id: string) => {
    "use server";
    await db.ticket.delete({
      where: { id },
    });
  };

  const updateTicketScanStatus = async (id: string, scanned: boolean) => {
    "use server";
    await db.ticket.update({
      where: { id },
      data: {
        scanned,
        scanned_at: scanned ? new Date() : null,
      },
    });
  };

  const refresh = async () => {
    "use server";
    revalidatePath(`/staff/manage/event/event-sold-tickets/${id}`);
  };

  return (
    <Stack className="container mx-auto gap-2 py-10">
      <h1 className="text-2xl font-bold">Event Sold Tickets</h1>
      <p>View and manage all sold tickets for this event.</p>
      <EventSoldTicketsTable
        data={event.sold_tickets}
        deleteTicket={deleteTicket}
        updateTicketScanStatus={updateTicketScanStatus}
        onRefresh={refresh}
      />
    </Stack>
  );
}
