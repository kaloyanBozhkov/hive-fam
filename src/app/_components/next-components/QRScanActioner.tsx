"use client";

import QRScan from "../organisms/QRScanner.organism";

export const QRScanActioner = () => {
  return (
    <QRScan
      onDecodedQR={(url) => {
        const to = url.startsWith("https://") ? url : `https://${url}`;
        window.location.href = to;
      }}
      doneChildren={<p>Scan successful. Redirecting...</p>}
      validateDecodedString={async (str) => {
        if (!(str.includes("http") || str.includes("www."))) return false;
        if (!str.includes("/validate/")) return false;
        return true;
      }}
    />
  );
};
