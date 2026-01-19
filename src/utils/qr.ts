import { fetchPostJSON } from "./common";

export interface QRViewData {
  id: string;
  description?: string | null;
  forward_to_url: string;
  visit_count: number;
  qrCodeDataURL: string;
  qr_contents?: string;
}

/**
 * Opens a QR code in a new tab with a nicely formatted display page
 * @param qrData - The QR code data to display
 */
export const viewQRCodeInNewTab = (qrData: QRViewData): void => {
  const description = qrData.description ?? `QR Code ${qrData.id}`;

  // Create HTML content as a Blob
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${description}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
          }
          h1 {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 24px;
            font-weight: 600;
          }
          img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 0 auto;
            display: block;
          }
          .info {
            margin-top: 20px;
            color: #666;
            font-size: 14px;
          }
          .url {
            word-break: break-all;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            margin-top: 10px;
            border: 1px solid #e9ecef;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
          }
          .stat {
            margin-top: 15px;
            font-weight: 500;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              padding: 20px;
            }
            h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${description}</h1>
          <img src="${qrData.qrCodeDataURL}" alt="QR Code" />
          <div class="info">
            ${qrData.qr_contents ? `<p><strong>Embedded URL:</strong></p><div class="url">${qrData.qr_contents}</div>` : ""}
            <p><strong>Forwards to:</strong></p>
            <div class="url">${qrData.forward_to_url}</div>
            <p class="stat"><strong>Total Visits:</strong> ${qrData.visit_count}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    // Open the blob URL in a new tab
    const newTab = window.open(url, "_blank");

    if (!newTab) {
      alert("Please allow popups to view QR code");
      URL.revokeObjectURL(url); // Clean up if failed to open
    } else {
      // Clean up the blob URL after a short delay to ensure it loads
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }
  } catch (error) {
    console.error("Failed to open QR code viewer:", error);
    alert("Failed to open QR code viewer");
  }
};

/**
 * Generates QR code data URL using the organization's QR API
 * @param qrContent - The content to encode in the QR code
 * @param organizationId - The organization ID for branding
 * @param skipBranding - If true, returns raw QR without logo
 * @returns Promise resolving to the QR code data URL
 */
export const generateQRCodeDataURL = async (
  qrContent: string,
  organizationId: string,
  skipBranding = false,
): Promise<string> => {
  try {
    const QRCodes = await fetchPostJSON<{ dataURL: string }[]>(
      "/api/qr/getQRCodes",
      {
        qrs: [{ urlContent: qrContent }],
        orgId: organizationId,
        skipBranding,
      },
    );
    const qrCodeDataURL = QRCodes[0]?.dataURL ?? QRCodes[0];

    if (!qrCodeDataURL || typeof qrCodeDataURL !== "string") {
      throw new Error("Invalid QR code response format");
    }

    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};
