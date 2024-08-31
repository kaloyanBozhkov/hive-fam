import { type Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe> | undefined;

const getStripe = () => {
  if (!stripePromise)
    // eslint-disable-next-line
    // @ts-expect-error
    // eslint-disable-next-line
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  return stripePromise;
};

export default getStripe;
