import QRCode from "qrcode";

import {
  BRIGHT_COLOR,
  MARGIN,
  QR_CANVAS_CONFIG,
  scaleSize,
} from "@/server/qr/constants";

/**
 * Generates an unbranded QRCode
 */
export const generateQRDataURLs = (
  qrCodes: { urlContent: string }[],
  { qrSize }: { qrSize: number } = { qrSize: QR_CANVAS_CONFIG.qrSize },
) =>
  Promise.all(
    qrCodes.map(async ({ urlContent }) => {
      const isBright = false,
        dataURL = await QRCode.toDataURL(urlContent, {
          // 30% error rate correction -> allows us to palce logo on top of QR code
          errorCorrectionLevel: "H",
          width: qrSize,
          margin: scaleSize(qrSize, MARGIN) / scaleSize(qrSize, 10),
          maskPattern: 0,
          color: {
            dark: undefined,
            light: isBright ? BRIGHT_COLOR : undefined,
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
