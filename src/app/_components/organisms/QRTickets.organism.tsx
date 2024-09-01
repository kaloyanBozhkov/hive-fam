import Stack from "../layouts/Stack.layout";
import { getQRCodes } from "@/server/qr/getQRCodes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn/Card.shadcn";

const QRTickets = async ({ contents }: { contents: string[] }) => {
  const qrCodes = (await getQRCodes(contents)) as { dataURL: string }[];

  return (
    <Stack className="gap-4">
      {qrCodes.map(({ dataURL }, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>Ticket {idx + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <img className="max-w-[300px]" src={dataURL} alt={`Ticket #${idx + 1}`} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default QRTickets;
