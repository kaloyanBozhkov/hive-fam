import { env } from "@/env";
import Stripe from "stripe";

export const stripeCli = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});
