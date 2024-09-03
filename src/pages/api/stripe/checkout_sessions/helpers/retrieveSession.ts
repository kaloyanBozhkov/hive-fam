import { stripeCli } from "@/server/stripe/stripe";
import type Stripe from "stripe";

export const retrieveSession = async (sessionId: string) => {
  const session: Stripe.Checkout.Session =
    await stripeCli.checkout.sessions.retrieve(sessionId, {
      expand: [
        // 'payment_intent',
        "shipping_cost.shipping_rate",
        "line_items",
        "customer",
        "line_items.data.price.product",
      ],
    });
  return session;
};