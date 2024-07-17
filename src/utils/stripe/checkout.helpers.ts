// import { stripeCli } from "@/server/stripe/stripe";
// import { fetchPostJSON } from "../common";
// import getStripe from "./getStripe";
// import { type CartCheckoutPayloadBody } from "@/pages/api/stripe/checkout_sessions";

/** Cart checkout */
export const cartCheckout = async (
  {
    // total,
    // currency,
    // productsInCart,
    // onCancelRedirectTo,
  }: {
    total: number;
    /* provide relative since BE adds https://domain.com/ */
    onCancelRedirectTo?: string;
    currency: "EUR";
    productsInCart: {
      eventName: string;
      ticketPrice: number;
    }[];
  },
) => {
  // const stripe = await getStripe();

  // if (!stripe) throw Error("Stripe not loaded yet?!");

  // const sessionId = await fetchPostJSON<string>(
  //   "/api/stripe/checkout_sessions",
  //   {
  //     amount: total,
  //     currency,
  //     onCancelRedirectTo,
  //     items: productsInCart.map(({}) => ({
  //       eventName: "",
  //       ticketPrice: 10,
  //     })),
  //   } as CartCheckoutPayloadBody,
  // );

  // const result = await stripeCli.redirectToCheckout({ sessionId });

  // if (result?.error) throw result.error.message;
  return "";
};
