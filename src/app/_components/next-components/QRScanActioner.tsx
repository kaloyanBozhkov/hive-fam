"use client";

import QRScan from "../organisms/QRScanner.organism";

export const QRScanActioner = () => {
  return (
    <QRScan
      onDecodedQR={(url) => (window.location.href = url)}
      doneChildren={<p>Scan successful. Redirecting...</p>}
      validateDecodedString={async (str) => {
        if (!str.includes("http")) return false;
        if (!str.includes("/validate/")) return false;
        return true;
      }}
    />
  );
};
