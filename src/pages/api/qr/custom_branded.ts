import { getOrg } from "@/server/actions/org";
import { brandQRCodes } from "@/server/qr/brandQRCodes";
import { generateQRDataURLs } from "@/server/qr/generateQRCodes";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const getQRCodesSchema = z.object({
  content: z.string(),
  orgId: z.string().uuid().optional(),
});

// is obsolete as we can generate in component itself -> server actions!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { content, orgId } = getQRCodesSchema.parse(req.query);
    const org = await getOrg(orgId);
    const qrCodes = await generateQRDataURLs(
      [{ urlContent: content }],
      undefined,
      org,
    );
    const brandedQRCodes = orgId ? await brandQRCodes(qrCodes, org) : qrCodes;

    // Create an HTML page with the content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code</title>
      </head>
      <body>
          <h1>Your QR Code</h1>
          <img src="${brandedQRCodes[0]!.dataURL}" alt="QR Code" />
          <p>Content: ${content}</p>
      </body>
      </html>
    `;

    res.status(200).send(htmlContent); // Send the HTML content as the response
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error });
    }
  }
}
