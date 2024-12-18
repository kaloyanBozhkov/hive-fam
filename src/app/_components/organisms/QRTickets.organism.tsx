import Stack from "../layouts/Stack.layout";
import { getQRCodes } from "@/server/qr/getQRCodes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn/Card.shadcn";
import { formatTicketSignedUrls, getTicketShareUrl } from "@/utils/tickets";
import { ButtonCopy } from "../molecules/CopyButton.moleule";
import { DownloadButton } from "../molecules/DownloadButton.molecule";

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
      {qrCodes.map(({ dataURL }, idx) => {
        const id = `ticket-${tickets[idx]!.count}`;
        return (
          <Card key={idx} id={id}>
            <CardHeader>
              <CardTitle>Ticket #{tickets[idx]!.count}</CardTitle>
            </CardHeader>
            <CardContent className="flex w-full flex-col gap-8 sm:flex-row">
              <Stack className="w-fit gap-2">
                <img
                  className="w-full max-w-[350px]"
                  src={dataURL}
                  alt={`Ticket #${idx + 1}`}
                />
                {withShare && (
                  <ButtonCopy
                    data-print="hide-copy"
                    value={getTicketShareUrl(tickets[idx]!.id)}
                  />
                )}
                <DownloadButton
                  selector={`#${id}`}
                  fileName={`ticket-${tickets[idx]!.count}`}
                  variant={withShare ? "secondary" : "default"}
                  className={withShare ? "shadow-md" : ""}
                  alsoHideSelector={withShare ? "[data-print='hide-copy']" : ""}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default QRTickets;
