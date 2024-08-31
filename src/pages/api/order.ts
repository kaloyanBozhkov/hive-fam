import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const querySchema = z.object({
  session_id: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    querySchema.parse(req.query);

    res.status(301).redirect("/checkout/success");
  } catch (error) {
    res.status(301).redirect("/");
  }
}
