import type Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { stripeCli } from "../../../../server/stripe/stripe";
import { formatAmountForStripe } from "../../../../server/stripe/stripe.helpers";

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
            shipping_address: {
              message: "For more info, contact us at EMAILHERE",
            },
          },
          customer_creation: "always",
          shipping_address_collection: {
            allowed_countries: [
              "GB",
              "SE",
              "CH",
              "BG",
              "NL",
              "AD",
              "AL",
              "AT",
              "BA",
              "BE",
              "BY",
              "CY",
              "CZ",
              "DE",
              "DK",
              "EE",
              "ES",
              "FI",
              "FO",
              "FR",
              "GG",
              "GI",
              "GR",
              "HR",
              "HU",
              "IE",
              "IM",
              "IS",
              "IT",
              "JE",
              "LI",
              "LT",
              "LU",
              "LV",
              "MC",
              "MD",
              "ME",
              "MK",
              "MT",
              "NO",
              "PL",
              "PT",
              "RO",
              "RS",
              "RU",
              "SI",
              "SJ",
              "SK",
              "SM",
              "UA",
              "VA",
            ],
          },
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