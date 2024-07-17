import type Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "../../../../server/stripe/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id: string = req.query.id as string;

  try {
    if (!id.startsWith("cs_")) throw Error("Incorrect CheckoutSession ID.");

    const checkoutSession: Stripe.Checkout.Session =
      await stripeCli.checkout.sessions.retrieve(id, {
        expand: [
          // 'payment_intent',
          "shipping_cost.shipping_rate",
          "line_items",
          "customer",
          "line_items.data.price.product",
        ],
      });

    res.status(200).json(checkoutSession);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}
