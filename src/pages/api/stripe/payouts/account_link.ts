import type Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripeCli } from "@/server/stripe/stripe";
import { z } from "zod";

const accountLinkSchema = z.object({
  account: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const validatedBody = accountLinkSchema.parse(req.body);
      const { account } = validatedBody;

      const accountLink = await stripeCli.accountLinks.create({
        account: account,
        return_url: `${req.headers.origin}/return/${account}`,
        refresh_url: `${req.headers.origin}/refresh/${account}`,
        type: "account_onboarding",
      });

      res.json(accountLink);
    } catch (error: any) {
      console.error(
        "An error occurred when calling the Stripe API to create an account link:",
        error,
      );
      res.status(500).send({ error: error?.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
