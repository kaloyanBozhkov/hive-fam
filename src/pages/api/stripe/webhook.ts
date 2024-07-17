import { type RequestHandler, buffer } from "micro";
import Cors from "micro-cors";
import Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { sendOrderReceiptEmail } from "@/server/email/send";

import Sock, { type LayoutType } from "@/classes/Sock";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  }),
  webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

// string => pId, mapped to prompt\n\n\ncolor\n\n\nlayouType
export type CheckoutSessionMetadata = Record<string, string>;

const cors = Cors({
    allowMethods: ["POST", "HEAD"],
  }),
  webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const sig = req.headers["stripe-signature"]!;
      let buf: Buffer;
      let event: Stripe.Event;

      try {
        buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
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
          const session = event.data.object as Stripe.Checkout.Session,
            metadata = session.metadata as CheckoutSessionMetadata,
            productDetails: Sock[] = Object.keys(metadata).map((pId) => {
              const vals = metadata[pId]!.split("\n\n\n");
              return new Sock(vals[0]!, vals[1], pId, vals[2] as LayoutType);
            });

          await sendOrderReceiptEmail({
            customerDetails: {
              phone: session.customer_details!.phone,
              email: session.customer_details!.email,
              name: session.customer_details!.name,
            },
            productDetails,
            shippingDetails: session.shipping_details!,
          });

          console.log("receipt email sent successfully!!!!!");
          break;
        }
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // eslint-disable-next-line
          console.log(
            `❌ Payment failed: ${paymentIntent?.last_payment_error?.message}`,
          );
          break;
        }
        case "charge.succeeded": {
          const charge = event.data.object as Stripe.Charge;
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

export default cors(webhookHandler as RequestHandler);
