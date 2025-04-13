import { type RequestHandler, buffer } from "micro";
import Cors from "micro-cors";
import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { env } from "@/env";
import type { Currency } from "@prisma/client";
import { createOrderTicketsAndSendEmail } from "@/server/tickets/createTickets";
import type { OrderLineItemMetadata, OrderMetadata } from "./checkout_sessions";
import { confirmPayoutsAccountLink } from "@/server/actions/stripe/getPayoutsAccountLink";
import { createInvoice } from "@/server/queries/invoice/createInvoice";
import {
  formatAmountForStripe,
  formatAmountFromStripe,
} from "@/server/stripe/stripe.helpers";

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

export type StripeItemMetadata = {
  consumed: boolean;
};

// eslint-disable-next-line
const cors = Cors({
    allowMethods: ["POST", "HEAD"],
  }),
  webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const sig = req.headers["stripe-signature"]!;
      let buf: Buffer;
      let event: Stripe.Event;

      try {
        // eslint-disable-next-line
        buf = await buffer(req);
        event = stripeCli.webhooks.constructEvent(buf, sig, webhookSecret);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        // On error, log and return the error message.
        if (err instanceof Error) console.log(err);
        console.log(`❌ Error message: ${errorMessage}`);
        res.status(400).send(`Webhook Error: ${errorMessage}`);
        return;
      }

      // Successfully constructed event.
      console.log("✅ Success:", event.id);

      // Cast event data to Stripe object.
      switch (event.type) {
        case "checkout.session.completed": {
          console.log("session completed ran");
          const session = event.data.object;
          console.log(session);
          const checkoutSessionId = session.id;
          const customerDetails = session.customer_details as CustomerDetails;
          const currency = session.currency!.toUpperCase() as Currency;
          const amountDiscount = session.total_details?.amount_discount;
          const total = session.amount_total!;

          if (!session.metadata) throw Error("No metadata found");

          const lineItems = await stripeCli.checkout.sessions.listLineItems(
            session.id,
            // to include the product metadata
            { expand: ["data.price.product"] },
          );
          const lineItemsData = lineItems.data.map((item) => ({
            quantity: item.quantity ?? 1,
            metadata: (
              item.price!.product as unknown as {
                metadata: OrderLineItemMetadata;
              }
            ).metadata,
            price: item.price!.unit_amount,
          }));

          // skip tax line item or any line item without a ticket type id
          const ticketsLineItems = lineItemsData.filter(
            (item) => item.metadata?.ticketTypeId,
          );
          const taxLineItem = lineItemsData.find(
            (item) => item.metadata.is_tax_item === "true",
          );

          const { eventId } = session.metadata as unknown as OrderMetadata;
          if (!eventId || ticketsLineItems.length === 0)
            throw Error("Invalid metadata");

          // TODO: can be mered w createOrderTicketsAndSendEmail
          const invocieId = await createInvoice({
            eventId,
            currency,
            orderSessionId: checkoutSessionId,
            amountDiscount: formatAmountFromStripe(
              amountDiscount ?? 0,
              currency,
            ),
            totalAmount: formatAmountFromStripe(total, currency),
            totalTaxAmount:
              typeof taxLineItem?.price === "number"
                ? formatAmountFromStripe(taxLineItem.price, currency)
                : null,
          });

          // also sends email
          await createOrderTicketsAndSendEmail({
            eventId,
            customerDetails,
            invocieId,
            currency,
            checkoutSessionId,
            tickets: ticketsLineItems.map((t) => ({
              ticketTypeId: t.metadata.ticketTypeId,
              quantity: t.quantity,
            })),
          });

          break;
        }
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object;
          // eslint-disable-next-line
          console.log(
            `❌ Payment failed: ${paymentIntent?.last_payment_error?.message}`,
          );
          break;
        }
        case "charge.succeeded": {
          const charge = event.data.object;
          console.log(`💵 Charge id: ${charge.id}`);
          break;
        }
        case "account.external_account.created": {
          const account = event.data.object;
          console.log(`💵 Account id: ${account.id}`);
          break;
        }
        case "account.updated": {
          const account = event.data.object;
          if (account.charges_enabled && account.details_submitted) {
            console.log(
              `✅ Account ${account.id} is now fully set up and ready to process payments`,
            );
            await confirmPayoutsAccountLink(account.id);

            // now it's time to transfer all their money into the account
          }
          break;
        }
        default:
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      }

      // Return a response to acknowledge receipt of the event.
      res.json({ received: true });
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  };

// eslint-disable-next-line
export default cors(webhookHandler as RequestHandler);

export type CustomerDetails = {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string | null;
  };
  email: string;
  name: string;
  phone: string;
  tax_exempt: "none" | "exempt" | "reverse";
  tax_ids: unknown[]; // You might want to define a more specific type for tax_ids if needed
};
