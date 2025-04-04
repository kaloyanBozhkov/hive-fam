import { getOrg } from "@/server/actions/org";
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
  orgId: z.string().uuid(),
});

// is obsolete as we can generate in component itself -> server actions!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { qrs, orgId } = getQRCodesSchema.parse(req.body);
    const org = await getOrg(orgId);
    const qrCodes = await generateQRDataURLs(qrs, undefined, org);
    const brandedQRCodes = await brandQRCodes(qrCodes, org);
    res.status(200).json(brandedQRCodes);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error });
    }
  }
}
