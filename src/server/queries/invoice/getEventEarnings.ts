"use server";

import { isAdminOrAbove } from "@/server/auth/roleGates";
import type { Currency } from "@prisma/client";
import type { InvoicesData } from "./getInvoices";
import getInvoices from "./getInvoices";

export const getEventEarnings = async (
  eventId: string,
  invoicesData?: InvoicesData,
) => {
  await isAdminOrAbove();
  const invoices = invoicesData ?? (await getInvoices({ eventId }));
  const totalRevenueByCurrency = await getEventEarningsByCurrency(invoices);
  return totalRevenueByCurrency;
};

export const getEventEarningsByCurrency = async (invoices: InvoicesData) => {
  return Object.entries(
    invoices.reduce(
      (acc, invoice) => {
        const currency = invoice.currency;
        acc[currency] = (acc[currency] ?? 0) + invoice.total_amount;
        return acc;
      },
      {} as Record<Currency, number>,
    ),
  ).map(([currency, total]) => ({
    currency,
    total,
  }));
};
