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

  // check if this email already got tickets
  const userAlreadyClaimedTicketsWithThatEmail = await db.participant.findFirst(
    {
      where: {
        email,
        tickets: {
          some: {
            is_free: true,
            event_id: eventId,
          },
        },
      },
      select: { id: true },
    },
  );

  if (userAlreadyClaimedTicketsWithThatEmail) {
    return {
      success: false,
      reason: "ALREADY_CLAIMED_WITH_THAT_EMAIL" as const,
    };
  }

  // also sends email
  await createOrderTicketsAndSendEmail({
    eventId,
    customerDetails: { email, name },
    currency: org.default_currency,
    checkoutSessionId,
    totalTickets: quantity,
    ticketPrice: 0,
  });

  return { success: true, sessionId: checkoutSessionId };
};
