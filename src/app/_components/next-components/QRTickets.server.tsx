import { getQRCodes } from "@/server/qr/getQRCodes";
import { formatTicketSignedUrls } from "@/utils/tickets";
import QRTickets from "../organisms/QRTickets.organism";

const QRTicketsServer = async ({
  tickets,
  withShare = true,
}: {
  tickets: { id: string; count: number }[];
  withShare?: boolean;
}) => {
  const contents = formatTicketSignedUrls(tickets.map(({ id }) => id));
  const qrCodes = (await getQRCodes(contents)) as { dataURL: string }[];
  return (
    <QRTickets qrCodes={qrCodes} tickets={tickets} withShare={withShare} />
  );
};

export default QRTicketsServer;
