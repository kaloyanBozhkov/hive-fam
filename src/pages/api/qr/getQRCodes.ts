import { brandQRCodes } from "@/server/qr/brandQRCodes";
import { generateQRDataURLs } from "@/server/qr/generateQRCodes";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const getQRCodesSchema = z.object({
  qrs: z.array(
    z.object({
      urlContent: z.string(),
    }),
  ),
});

// is obsolete as we can generate in component itself -> server actions!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { qrs } = getQRCodesSchema.parse(req.body);
    const qrCodes = await generateQRDataURLs(qrs);
    const brandedQRCodes = await brandQRCodes(qrCodes);
    res.status(200).json(brandedQRCodes);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error });
    }
  }
}