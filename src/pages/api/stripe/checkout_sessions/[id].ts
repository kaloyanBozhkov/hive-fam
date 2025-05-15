import { type NextApiRequest, type NextApiResponse } from "next";
import { retrieveSession } from "./_helpers/retrieveSession";
import { isValidSessionId } from "./_helpers/isValidSessionId";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id: string = req.query.id as string;
  try {
    if (!isValidSessionId(id)) throw Error("Incorrect CheckoutSession ID.");
    const checkoutSession = await retrieveSession(id);
    res.status(200).json(checkoutSession);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}
