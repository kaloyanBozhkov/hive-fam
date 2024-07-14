import { env } from "@/env";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const adminSchema = z.object({
  secret: z.literal(env.ADMIN_SECRET),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    adminSchema.parse(req.query);
    res.status(301).redirect(env.ADMIN_PAGE);
  } catch (error) {
    res.status(301).redirect("/");
  }
}
