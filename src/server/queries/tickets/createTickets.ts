import type { CustomerDetails } from "@/pages/api/stripe/webhook";
import { db } from "@/server/db";
import type { Currency } from "@prisma/client";

export const createTickets = async ({
  eventId,
  customerDetails, // who bought the tickets
  orderSessionId,
  tickets,
  currency,
}: {
  eventId: string;
  customerDetails: Partial<CustomerDetails> &
    Pick<CustomerDetails, "email" | "name">;
  orderSessionId: string;
  // ticketTypeId is optional for free tickets
  tickets: { ticketTypeId?: string | null; quantity: number }[];
  currency: Currency;
}) => {
  const participantEmail = customerDetails.email;
  const [name, ...surname] = customerDetails.name.split(" ").filter((w) => w);
  const participantDetails = {
    email: participantEmail,
    name: name?.trim() ?? "unknown",
    surname: surname.join(" ").trim() ?? "unknown",
    phone: customerDetails.phone,
    country: customerDetails?.address?.country,
    city: customerDetails?.address?.city,
    address: customerDetails?.address?.line1,
    postal_code: customerDetails?.address?.postal_code,
    line1: customerDetails?.address?.line1,
    line2: customerDetails?.address?.line2,
    state: customerDetails?.address?.state,
  };

  const participant = await db.participant.upsert({
    where: { email: participantEmail },
    update: participantDetails,
    create: participantDetails,
  });

  const event = await db.event.findUniqueOrThrow({
    where: { id: eventId },
    select: { is_free: true },
  });

  const ticketTypes = await db.event_ticket_type.findMany({
    where: { event_id: eventId },
  });

  const ticketsToCreate = tickets.flatMap((ticket) =>
    Array.from({ length: ticket.quantity })
      .map(() => ({
        currency,
        event_id: eventId,
        owner_id: participant.id,
        order_session_id: orderSessionId,
        is_free: event.is_free,
        ticket_type_id: ticket.ticketTypeId,
        price:
          ticketTypes.find((t) => t.id === ticket.ticketTypeId)?.price ?? 0,
      }))
      .map((t, idx) => ({ ...t, count: idx + 1 })),
  );

  await db.ticket.createMany({
    data: ticketsToCreate,
  });
};
