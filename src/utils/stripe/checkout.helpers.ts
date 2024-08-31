import { fetchPostJSON } from "../common";
import getStripe from "./getStripe";
import { type CartCheckoutPayloadBody } from "@/pages/api/stripe/checkout_sessions";
import { type Stripe } from "@stripe/stripe-js";

/** Cart checkout */
export const cartCheckout = async ({
  total,
  currency,
  productsInCart,
  onCancelRedirectTo,
}: {
  total: number;
  /* provide relative since BE adds https://domain.com/ */
  onCancelRedirectTo?: string;
  currency: "BGN";
  productsInCart: {
    eventName: string;
    ticketPrice: number;
  }[];
}) => {
  // eslint-disable-next-line
  const stripe = (await getStripe()) as Stripe;

  if (!stripe) throw Error("Stripe not loaded yet?!");

  const sessionId = await fetchPostJSON<string>(
    "/api/stripe/checkout_sessions",
    {
      amount: total,
      currency,
      onCancelRedirectTo,
      items: productsInCart.map(({ eventName, ticketPrice }) => ({
        eventName,
        ticketPrice,
      })),
    } as CartCheckoutPayloadBody,
  );

  // eslint-disable-next-line
  const result = await stripe.redirectToCheckout({ sessionId });

  // eslint-disable-next-line
  if (result?.error) throw result.error.message;
};
