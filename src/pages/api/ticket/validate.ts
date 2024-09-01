import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { isValidSessionId } from "../stripe/checkout_sessions/helpers/isValidSessionId";
import { retrieveSession } from "../stripe/checkout_sessions/helpers/retrieveSession";

const getQRCodesSchema = z.object({
  sessionId: z.string(),
  lineItemId: z.string(),
  staffSecret: z.string(),
});

// is obsolete as we can generate in component itself -> server actions!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { sessionId, lineItemId, staffSecret } = getQRCodesSchema.parse(
      req.body,
    );

    if (!isValidSessionId(sessionId))
      throw Error("Incorrect CheckoutSession ID.");

    const session = await retrieveSession(sessionId);


    res.status(200).json({});
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error });
    }
  }
}
