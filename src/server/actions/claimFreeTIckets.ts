"use server";

import { createUUID } from "@/utils/common";
import { createOrderTicketsAndSendEmail } from "../tickets/createTickets";
import { db } from "../db";

export const claimFreeTickets = async ({
  quantity,
  eventId,
  email,
  name,
}: {
  quantity: number;
  eventId: string;
  email: string;
  name: string;
}) => {
  const checkoutSessionId = `free-${createUUID()}`;
  const org = await db.organization.findFirstOrThrow({
    where: {
      events: {
        some: {
          id: eventId,
        },
      },
    },
    select: {
      default_currency: true,
    },
  });

  // also sends email
  await createOrderTicketsAndSendEmail({
    eventId,
    customerDetails: { email, name },
    currency: org.default_currency,
    checkoutSessionId,
    totalTickets: quantity,
    ticketPrice: 0,
  });

  return { sessionId: checkoutSessionId };
};
