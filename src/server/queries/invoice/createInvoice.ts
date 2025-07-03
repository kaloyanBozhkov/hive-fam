import { db } from "@/server/db";
import type { Currency } from "@prisma/client";
import assert from "assert";

export const createInvoice = async ({
  eventId,
  orderSessionId,
  currency,
  totalAmount,
  amountDiscount,
  totalTaxAmount,
}: {
  eventId: string;
  orderSessionId: string;
  currency: Currency;
  totalAmount: number;
  amountDiscount: number;
  totalTaxAmount?: number | null;
}) => {
  const event = await db.event.findUniqueOrThrow({
    where: { id: eventId },
    select: {
      organization: {
        select: {
          id: true,
          tax_calculation_type: true,
          tax_percentage: true,
        },
      },
    },
  });

  assert(event.organization, "createInvoice - Event organization not found");

  const existingInvoice = await db.invoice.findFirst({
    where: {
      event_id: eventId,
      order_session_id: orderSessionId,
    },
  });

  if (existingInvoice) {
    console.log(
      "Invoice already exists - ticket creation (next step) probably failed",
    );
    return existingInvoice.id;
  }

  const invoice = await db.invoice.create({
    data: {
      event_id: eventId,
      order_session_id: orderSessionId,
      currency,
      total_amount: totalAmount,
      amount_discount: amountDiscount,
      tax_percentage: event.organization.tax_percentage,
      tax_calculation_type: event.organization.tax_calculation_type,
      organization_id: event.organization.id,
      total_tax_amount: totalTaxAmount,
    },
  });

  return invoice.id;
};
