"use client";

import QRScan from "../organisms/QRScanner.organism";

export const QRScanActioner = () => {
  return (
    <QRScan
      onDecodedQR={(url) => (window.location.href = url)}
      doneChildren={<p>Scan successful. Redirecting...</p>}
      validateDecodedString={async (str) => {
        debugger;
        if (!(str.includes("http") || str.includes("www."))) return false;
        if (!str.includes("/validate/")) return false;
        return true;
      }}
    />
  );
};
