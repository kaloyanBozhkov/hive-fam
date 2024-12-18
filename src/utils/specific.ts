import { event as Event } from "@prisma/client";
import { addHours } from "date-fns";

// TODO add longer period events?
const EVENT_CLOSED_AFTER_H = 12;

export const isPastEvent = (event: Partial<Event>) => {
  const tomorrow = addHours(new Date(), EVENT_CLOSED_AFTER_H).getTime();
  return !!event.date && event.date.getTime() < tomorrow;
};
