import { stripeCli } from "@/server/stripe/stripe";
import type Stripe from "stripe";

export const updateOrderMetadata = async (
  paymentIntent: Stripe.PaymentIntent,
  flagKey: string,
  flagValue: boolean,
) => {
  try {
    const paymentIntentId = paymentIntent.id;
    await stripeCli.paymentIntents.update(paymentIntentId, {
      metadata: {
        [flagKey]: flagValue.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating session metadata:", error);
  }
};
