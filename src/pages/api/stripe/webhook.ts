import { type RequestHandler, buffer } from "micro";
import Cors from "micro-cors";
import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { env } from "@/env";
import type { Currency } from "@prisma/client";
import { createTickets } from "@/server/queries/tickets/createTickets";

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
          // const amountDiscount = session.total_details?.amount_discount;
          // const total = session.amount_total!;

          if (!session.metadata) throw Error("No metadata found");

          const { eventId, totalTickets, ticketPrice } = session.metadata;
          if (!eventId || !totalTickets || !ticketPrice)
            throw Error("Invalid metadata");

          await createTickets({
            customerDetails,
            eventId,
            currency,
            totalTickets: Number(totalTickets),
            ticketPrice: Number(ticketPrice),
            orderSessionId: checkoutSessionId,
          });

          // await sendOrderReceiptEmail({
          //   customerDetails,
          //   orderSessionId: checkoutSessionId,
          // });

          // console.log("receipt email sent successfully!!!!!");
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
