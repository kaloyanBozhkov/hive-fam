import Stack from "../layouts/Stack.layout";
import { getQRCodes } from "@/server/qr/getQRCodes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn/Card.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import { formatTicketSignedUrls, getTicketShareUrl } from "@/utils/tickets";
import { ButtonCopy } from "../molecules/CopyButton.moleule";

const QRTickets = async ({
  tickets,
  withShare = true,
}: {
  tickets: { id: string; count: number }[];
  withShare?: boolean;
}) => {
  const contents = formatTicketSignedUrls(tickets.map(({ id }) => id));
  const qrCodes = (await getQRCodes(contents)) as { dataURL: string }[];

  return (
    <Stack className="gap-4">
      {qrCodes.map(({ dataURL }, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>Ticket #{tickets[idx]!.count}</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <Stack className="w-fit gap-2">
              <img
                className="w-full max-w-[350px]"
                src={dataURL}
                alt={`Ticket #${idx + 1}`}
              />
              {withShare && (
                <ButtonCopy value={getTicketShareUrl(tickets[idx]!.id)} />
              )}
              <Button>Download</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default QRTickets;
