import { formatTicketSignedUrls } from "@/utils/tickets";
import QRTickets from "../organisms/QRTickets.organism";
import { getOrgId } from "@/server/actions/org";
import { fetchPostJSON } from "@/utils/common";
import { DOMAIN_CONFIG } from "@/server/config";

const QRTicketsServer = async ({
  tickets,
  withShare = true,
}: {
  tickets: { id: string; count: number }[];
  withShare?: boolean;
}) => {
  const orgId = await getOrgId();
  const orgDomain = Object.entries(DOMAIN_CONFIG).find(
    ([, id]) => id === orgId,
  )?.[0];

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

  return (
    <QRTickets qrCodes={qrCodes} tickets={tickets} withShare={withShare} />
  );
};

export default QRTicketsServer;
