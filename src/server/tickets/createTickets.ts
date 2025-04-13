import { type Currency } from "@prisma/client";
import { sendOrderReceiptEmail } from "../email/sendOrderReceiptEmail";
import { createTickets } from "../queries/tickets/createTickets";
import { type CustomerDetails } from "@/pages/api/stripe/webhook";

export const createOrderTicketsAndSendEmail = async ({
  eventId,
  currency,
  customerDetails,
  checkoutSessionId,
  tickets,
  invocieId,
}: {
  eventId: string;
  currency: Currency;
  customerDetails: Partial<CustomerDetails> &
    Pick<CustomerDetails, "email" | "name">;
  checkoutSessionId: string;
  // ticketTypeId is optional for free tickets
  tickets: { ticketTypeId?: string | null; quantity: number }[];
  invocieId?: string;
}) => {
  await createTickets({
    customerDetails,
    eventId,
    currency,
    tickets,
    invocieId,
    orderSessionId: checkoutSessionId,
  });

  try {
    await sendOrderReceiptEmail({
      customerDetails,
      orderSessionId: checkoutSessionId,
      eventId,
    });
    console.log("receipt email sent successfully!!!!!");
  } catch (error) {
    console.warn("Failed to send order completed email");
  }
};
