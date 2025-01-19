import type { event_ticket_type } from "@prisma/client";
export type EventTicketType = event_ticket_type & {
  is_sold_out: boolean;
};
