import { getQRCodes } from "@/server/qr/getQRCodes";
import { formatTicketSignedUrls } from "@/utils/tickets";
import QRTickets from "../organisms/QRTickets.organism";
<<<<<<< Updated upstream
=======
import { getOrgId } from "@/server/actions/org";
import { fetchPostJSON } from "@/utils/common";
import { DOMAIN_CONFIG, getDomainFromOrgId } from "@/server/config";
>>>>>>> Stashed changes

const QRTicketsServer = async ({
  tickets,
  withShare = true,
}: {
  tickets: { id: string; count: number }[];
  withShare?: boolean;
}) => {
<<<<<<< Updated upstream
  const contents = formatTicketSignedUrls(tickets.map(({ id }) => id));
  const qrCodes = (await getQRCodes(contents)) as { dataURL: string }[];
=======
  const orgId = await getOrgId();
  const orgDomain = getDomainFromOrgId(orgId);
  if (!orgDomain) console.warn("orgDomain inQRTicketsServer was undefined");

  const contents = formatTicketSignedUrls(
    orgDomain ?? "localhost",
    tickets.map(({ id }) => id),
  );

  const qrs = contents.map((urlContent) => ({ urlContent }));
  const qrCodes = await fetchPostJSON<{ dataURL: string }[]>(
    `https://${orgDomain}/api/qr/getQRCodes`,
    {
      qrs,
      orgId,
    },
  );

>>>>>>> Stashed changes
  return (
    <QRTickets qrCodes={qrCodes} tickets={tickets} withShare={withShare} />
  );
};

export default QRTicketsServer;
