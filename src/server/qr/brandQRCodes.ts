import { BRIGHT_COLOR, LOGO_TEXT } from "@/server/qr/constants";
import { scaleSize, QR_CANVAS_CONFIG } from "@/server/qr/constants";
import {
  createCanvas,
  GlobalFonts,
  loadImage,
  type SKRSContext2D,
} from "@napi-rs/canvas";
import { getFileFromUrl } from "@/server/utils.server";
import { getBaseUrl } from "@/utils/common";

/**
 * Generates an unbranded QRCode
 */ export const brandQRCodes = async (
  QRs: { dataURL: string }[],
  { qrSize }: { qrSize: number } = { qrSize: QR_CANVAS_CONFIG.qrSize },
): Promise<{ dataURL: string }[]> =>
  Promise.all(
    QRs.map(async ({ dataURL }) => {
      const isBright = false;
      return {
        dataURL: await brandQRCode({
          dataURL,
          canvasSize: qrSize,
          logoFileName: isBright
            ? "logo-bright-outlined-fat.png"
            : "logo-outlined-fat.png",
          fontBg: isBright ? BRIGHT_COLOR : undefined,
          withInvertQRColors: false,
          logoRadius: scaleSize(qrSize, QR_CANVAS_CONFIG.logoSize / 2),
          textBgRadius: scaleSize(qrSize, 5),
          fontSize: `${scaleSize(qrSize, 28)}px`,
          logoSize: scaleSize(qrSize, QR_CANVAS_CONFIG.logoSize),
        }),
      };
    }),
  ).catch((err) => {
    console.error("Could not brand QR codes {QRs}", QRs, err);
    return [];
  });

const brandQRCode = async ({
  withInvertQRColors,
  withInvertSpecificColors,
  dataURL,
  logoRadius,
  logoFileName,
  logoText = LOGO_TEXT,
  fontColor = "white",
  fontSize = "28px",
  fontBg = "black",
  canvasSize = QR_CANVAS_CONFIG.qrSize,
  logoSize = QR_CANVAS_CONFIG.logoSize,
  textBgRadius = 5,
}: {
  dataURL: string;
  withInvertQRColors?: boolean;
  withInvertSpecificColors?: Pixel[];
  logoRadius?: number;
  textBgRadius?: number;
  canvasSize: number;
  logoSize: number;
  logoText?: string;
  fontColor?: string;
  fontBg?: string;
  fontSize?: string;
  logoFileName: string;
}) => {
  const logoBuff = await getFileFromUrl(
    `${getBaseUrl()}/assets/images/${logoFileName}`,
  );

  if (!logoBuff) {
    console.error(
      `Could not get logo from url: ${getBaseUrl()}/assets/images/${logoFileName}`,
    );
    return "";
  }

  const logoBase64 = `data:image/jpg;base64,${logoBuff.toString()}`,
    logoImg = await loadImage(logoBase64),
    canvas = createCanvas(canvasSize, canvasSize),
    qrImg = await loadImage(dataURL),
    ctx = canvas.getContext("2d");

  if (!withInvertQRColors) {
    const imageSize = canvasSize - 40,
      borderSize = 20;

    // setup black border
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // crop white space from qr image
    ctx.rect(borderSize, borderSize, imageSize, imageSize);
    ctx.clip();

    ctx.drawImage(qrImg, 0, 0, canvasSize, canvasSize);
    ctx.restore();
  } else {
    ctx.drawImage(qrImg, 0, 0, canvasSize, canvasSize);
  }

  if (withInvertSpecificColors)
    invertSpecificColor(ctx, withInvertSpecificColors, canvasSize);

  if (withInvertQRColors) invertQRColors(ctx, canvasSize);

  const logoX = Math.floor(canvasSize / 2 - logoSize / 2),
    logoY = Math.floor(canvasSize / 2 - logoSize / 2);

  if (logoText) {
    const textBgY = logoY + logoSize,
      textBgX = logoX,
      textBgW = logoSize / 1.5,
      textBgH = Math.floor(logoSize / 5);

    GlobalFonts.registerFromPath(
      `${process.cwd()}/public/fonts/Rex-Bold.eot`,
      "Rex",
    );

    drawRoundRect(
      ctx,
      textBgX + textBgW / 4,
      textBgY,
      textBgRadius,
      textBgW,
      textBgH,
    );
    ctx.fillStyle = fontBg;
    ctx.fill();
    ctx.font = `${fontSize}px Rex`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.fillText(
      logoText,
      Math.floor(textBgX + logoSize / 2),
      Math.floor(textBgY + textBgH / 1.5),
    );
  }

  if (logoRadius) {
    drawRoundRect(ctx, logoX, logoY, logoRadius, logoSize, logoSize);

    ctx.clip();
  }

  ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

  return canvas.toDataURL();
};

type Pixel = { r: number; g: number; b: number };

const invertSpecificColor = (
    ctx: SKRSContext2D,
    colors: Pixel[],
    canvasSize: number,
  ) => {
    const img = ctx.getImageData(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < img.data.length; i += 4) {
      let r = img.data[i],
        g = img.data[i + 1],
        b = img.data[i + 2];

      if (
        colors.some((color) => r === color.r && g === color.g && b === color.b)
      ) {
        r = 255 - r!;
        g = 255 - g!;
        b = 255 - b!;
      }

      img.data[i] = r!;
      img.data[i + 1] = g!;
      img.data[i + 2] = b!;
      img.data[i + 3] = 255;
    }

    ctx.putImageData(img, 0, 0);
  },
  invertQRColors = (ctx: SKRSContext2D, canvasSize: number) => {
    invertSpecificColor(
      ctx,
      [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ],
      canvasSize,
    );
  },
  drawRoundRect = (
    ctx: SKRSContext2D,
    x: number,
    y: number,
    radius: number,
    width: number,
    height: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };
