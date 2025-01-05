import type { CustomerDetails } from "@/pages/api/stripe/webhook";
import { db } from "@/server/db";
import type { Currency } from "@prisma/client";

export const createTickets = async ({
  eventId,
  totalTickets,
  customerDetails, // who bought the tickets
  orderSessionId,
  ticketPrice,
  currency,
}: {
  eventId: string;
  totalTickets: number;
  customerDetails: Partial<CustomerDetails> &
    Pick<CustomerDetails, "email" | "name">;
  orderSessionId: string;
  ticketPrice: number;
  currency: Currency;
}) => {
  const participantEmail = customerDetails.email;
  const [name, surname] = customerDetails.name.split(" ");
  const participantDetails = {
    email: participantEmail,
    name: name ?? "unknown",
    surname: surname ?? "unknown",
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

  await db.ticket.createMany({
    data: Array.from({ length: totalTickets }).map((_, idx) => ({
      currency,
      event_id: eventId,
      owner_id: participant.id,
      order_session_id: orderSessionId,
      price: ticketPrice,
      count: idx + 1,
      is_free: ticketPrice === 0,
    })),
  });
};
