import Stack from "@/app/_components/layouts/Stack.layout";
import { QRScanActioner } from "@/app/_components/next-components/QRScanActioner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";

export default async function ScanPage() {
  return (
    <Stack className="gap-8">
      <Card>
        <CardHeader>
          <CardTitle>How to validate a ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-2">
            <p>
              <i>(Option 1)</i>
              <br />
              Scan via default camera app and just follow the link.
            </p>
            <p>
              <i>(Option 2)</i>
              <br />
              Make use of the below QR Scanner to scan a QR code or upload an
              image of a ticket.
            </p>
          </Stack>
        </CardContent>
      </Card>
      <QRScanActioner />
    </Stack>
  );
}
