import { env } from "@/env";
import { type Stripe, loadStripe } from "@stripe/stripe-js";

// eslint-disable-next-line
let stripePromise: Promise<Stripe | null> | undefined;

const getStripe = () => {
  if (!stripePromise)
    // eslint-disable-next-line
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return stripePromise;
};

export default getStripe;
