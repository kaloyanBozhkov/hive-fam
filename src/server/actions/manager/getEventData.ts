"use server";

import { db } from "@/server/db";
import { isManagerOrAbove } from "@/server/auth/roleGates";

export const getEventData = async () => {
  const user = await isManagerOrAbove();

  const d = await db.event.findMany({
    where: {
      organization_id: user.organization_id,
    },
    include: {
      venue: true,
      ticket_types: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return d;
};
