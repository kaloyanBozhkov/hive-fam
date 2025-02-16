import { formatTicketSignedUrls } from "@/utils/tickets";
import QRTickets from "../organisms/QRTickets.organism";
import { getOrgId } from "@/server/actions/org";
import { fetchPostJSON } from "@/utils/common";
import { getDomainFromOrgId } from "@/server/config";
import { db } from "@/server/db";

const getEventInfo = async (eventId: string) => {
  const event = await db.event.findFirstOrThrow({
    where: {
      id: eventId,
    },
    select: {
      title: true,
      date: true,
      end_date: true,
      venue: {
        select: {
          name: true,
          street_addr: true,
          city: true,
        },
      },
    },
  });

  return event;
};

const QRTicketsServer = async ({
  tickets,
  withShare = true,
  eventId,
}: {
  tickets: {
    id: string;
    // count the order of ticket for sharing purposes
    ticketNumber: number;
    ticketType: string;
  }[];
  withShare?: boolean;
  eventId: string;
}) => {
  const orgId = await getOrgId();
  let orgDomain = getDomainFromOrgId(orgId)!;
  if (!orgDomain) console.warn("orgDomain in QRTicketsServer was undefined");

  const contents = formatTicketSignedUrls(
    orgDomain,
    tickets.map(({ id }) => id),
  );
  const qrs = contents.map((urlContent) => ({ urlContent }));

  let protocol = "https";
  if (orgDomain.includes("localhost")) {
    orgDomain = "localhost:3000";
    protocol = "http";
  }
  const qrCodes = await fetchPostJSON<{ dataURL: string }[]>(
    `${protocol}://${orgDomain}/api/qr/getQRCodes`,
    {
      qrs,
      orgId,
    },
  );
  const event = await getEventInfo(eventId);

  return (
    <QRTickets
      qrCodes={qrCodes}
      tickets={tickets}
      withShare={withShare}
      eventName={event.title}
      eventDate={event.date}
      eventEndDate={event.end_date}
      eventLocation={`${event.venue.street_addr}, ${event.venue.city}`}
    />
  );
};

export default QRTicketsServer;
