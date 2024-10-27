// 300 DPI(dot/in) = 118 dpcm (dot/cm), our AIC target is 305 DPI (120dpcm)
export const DPI_SCALE_FIX = 120;

const SIZES_CM = {
  QR_LOGO: 2.14,
  QR: 6,
  CANVAS_WIDTH: 42,
  CANVAS_HEIGHT: 162,
  GAP: 2,
};
// canvas canvasWidth: (420mm), canvasHeight: (1620mm), padding/gap: (20mm), qrSize: (60mm x 60mm)
export const QR_CANVAS_CONFIG = {
  canvasWidth: SIZES_CM.CANVAS_WIDTH * DPI_SCALE_FIX,
  canvasHeight: SIZES_CM.CANVAS_HEIGHT * DPI_SCALE_FIX,
  padding: SIZES_CM.GAP * DPI_SCALE_FIX,
  qrSize: SIZES_CM.QR * DPI_SCALE_FIX,
  logoSize: SIZES_CM.QR_LOGO * DPI_SCALE_FIX,
};

export const MARGIN = 20;
export const BRIGHT_COLOR = "#949292";

/** Take pixel value relative to canvas size and return  */
export const scaleSize = (canvasSize: number, constant: number) =>
  Math.floor((constant * canvasSize) / QR_CANVAS_CONFIG.qrSize);
