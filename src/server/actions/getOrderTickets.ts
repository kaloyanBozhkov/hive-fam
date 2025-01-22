import { db } from "../db";

// also returns them with a fixed idx
export const getOrderTickets = async (sessionId: string) => {
  const tickets = await db.ticket.findMany({
    where: {
      order_session_id: sessionId,
    },
    include: {
      ticket_type: {
        select: {
          label: true,
        },
      },
      owner: {
        select: {
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      ticket_type: {
        created_at: "asc",
      },
    },
  });

  return {
    tickets: tickets.map(({ id, is_free, ticket_type }, idx) => {
      return {
        id,
        ticketNumber: idx + 1,
        isFree: is_free,
        ticketType: ticket_type?.label ?? "Free Entry",
      };
    }),
    ownerEmail: tickets[0]!.owner?.email,
    eventTitle: tickets[0]!.event.title,
    eventId: tickets[0]!.event.id,
  };
};
