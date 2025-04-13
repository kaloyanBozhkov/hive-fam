"use server";

import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";

const getInvoices = async ({ eventId }: { eventId: string }) => {
  const user = await isAdminOrAbove();
  const invoices = await db.invoice.findMany({
    where: { organization_id: user.organization_id, event_id: eventId },
    include: {
      _count: {
        select: {
          tickets: true,
        },
      },
    },
  });

  return invoices;
};

export default getInvoices;

export type InvoicesData = Awaited<ReturnType<typeof getInvoices>>;
