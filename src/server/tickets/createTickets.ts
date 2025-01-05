import { Currency } from "@prisma/client";
import { sendOrderReceiptEmail } from "../email/sendOrderReceiptEmail";
import { createTickets } from "../queries/tickets/createTickets";
import { CustomerDetails } from "@/pages/api/stripe/webhook";

export const createOrderTicketsAndSendEmail = async ({
  eventId,
  currency,
  customerDetails,
  checkoutSessionId,
  ticketPrice,
  totalTickets,
}: {
  eventId: string;
  currency: Currency;
  customerDetails: Partial<CustomerDetails> &
    Pick<CustomerDetails, "email" | "name">;
  checkoutSessionId: string;
  ticketPrice: number;
  totalTickets: number;
}) => {
  await createTickets({
    customerDetails,
    eventId,
    currency,
    totalTickets: totalTickets,
    ticketPrice: ticketPrice,
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
