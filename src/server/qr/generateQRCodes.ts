import QRCode from "qrcode";

import {
  BRIGHT_COLOR,
  MARGIN,
  QR_CANVAS_CONFIG,
  scaleSize,
} from "@/server/qr/constants";
import { organization } from "@prisma/client";

/**
 * Generates an unbranded QRCode
 */
export const generateQRDataURLs = (
  qrCodes: { urlContent: string }[],
  { qrSize }: { qrSize: number } = { qrSize: QR_CANVAS_CONFIG.qrSize },
  org: organization,
) =>
  Promise.all(
    qrCodes.map(async ({ urlContent }) => {
      const dataURL = await QRCode.toDataURL(urlContent, {
        // 30% error rate correction -> allows us to palce logo on top of QR code
        errorCorrectionLevel: "H",
        width: qrSize,
        margin: scaleSize(qrSize, MARGIN) / scaleSize(qrSize, 10),
        maskPattern: 0,
        color: {
          dark: org.qr_dark_color ?? undefined,
          light: org.qr_bright_color ?? BRIGHT_COLOR,
        },
      });

      return {
        dataURL,
      };
    }),
  ).catch((err) => {
    console.error(
      "Could not generate plain QR codes for {qrCodes}",
      qrCodes,
      err,
    );
    return [];
  });
