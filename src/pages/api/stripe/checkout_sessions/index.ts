import type Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { stripeCli } from "@/server/stripe/stripe";
import { formatAmountForStripe } from "@/server/stripe/stripe.helpers";

import EVENTS from "@/automated/events.json";

export type CartCheckoutPayloadBody = {
  amount: number;
  currency: "BGN";
  onCancelRedirectTo: string;
  items: {
    eventName: string;
    ticketPrice: number;
    accessType: "regular";
  }[];
};

const MIN_AMOUNT = 0.5,
  MAX_AMOUNT = 100000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // @TODO get cart from DB for user ID instead of passing all cart items here
  if (req.method === "POST") {
    const { amount, currency, items, onCancelRedirectTo } =
      req.body as CartCheckoutPayloadBody;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT))
        throw new Error("Invalid amount.");

      let onCancelRedirect = onCancelRedirectTo;

      if (!onCancelRedirectTo) onCancelRedirect = `/`;

      // validate costs with ticket cost on sheets
      if (items.length < 1) throw new Error("No items in cart");

      console.log(
        items,
        EVENTS.map((e) => [e.title, e.price]),
      );

      const eventPrices: Record<string, number> = EVENTS.reduce(
        (acc, e) => ({ ...acc, [e.title]: parseFloat(e.price) }),
        {},
      );

      if (items.some((p) => eventPrices[p.eventName] !== p.ticketPrice))
        throw new Error("Not matching prices for all items");

      const params: Stripe.Checkout.SessionCreateParams = {
          mode: "payment",
          submit_type: "pay",
          payment_method_types: ["card"],
          phone_number_collection: {
            enabled: true,
          },
          line_items: items.map((p) => ({
            price_data: {
              unit_amount: formatAmountForStripe(p.ticketPrice, currency),
              currency,
              product_data: {
                images: [],
                name: `Tiket - ${p.eventName}`,
                description: "Regular access",
              },
            },
            quantity: 1,
          })),
          billing_address_collection: "required",
          cancel_url: `${req.headers.origin!}/${onCancelRedirect}`,
          success_url: `${req.headers.origin!}/order?session_id={CHECKOUT_SESSION_ID}`,
          custom_text: {
            submit: {
              message: `Ready to claim these tickets?!`,
            },
          },
          customer_creation: "always",
          allow_promotion_codes: true,
        },
        checkoutSession: Stripe.Checkout.Session =
          await stripeCli.checkout.sessions.create(params);

      console.log("checkoutSession", checkoutSession);

      res.status(200).json(checkoutSession.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
