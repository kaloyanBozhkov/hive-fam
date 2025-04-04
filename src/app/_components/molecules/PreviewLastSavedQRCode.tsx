import Link from "next/link";

export const PreviewLastSavedQRCode = ({ orgId }: { orgId: string }) => {
  return (
    <p>
      Preview last saved QR code:{" "}
      <Link
        className="text-blue-500 underline"
        target="_blank"
        href={`/api/qr/custom_branded?content=https://www.google.com/search?q=this+will+lead+to+your+event&orgId=${orgId}`}
      >
        Open Preview
      </Link>
    </p>
  );
};
