import { getCustomQR } from "@/server/actions/qr/getCustomQR";
import { incrementCustomQR } from "@/server/actions/qr/incrementCustomQR";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.redirect(404, "/error");
  }

  const CustomQR = await getCustomQR(id);

  if (!CustomQR) {
    return res.redirect(404, "/error");
  }

  await incrementCustomQR(id);

  return res.redirect(CustomQR.forward_to_url);
}
