import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { z } from "zod";

const payload = z.object({
  email: z.string().email(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { email } = payload.parse(req.body);

      const account = await stripeCli.accounts.create({
        email,
        type: "express",
      });

      res.json({
        account: account.id,
      });
    } catch (error: any) {
      console.error(
        "An error occurred when calling the Stripe API to create an account",
        error,
      );
      res.status(500).send({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
