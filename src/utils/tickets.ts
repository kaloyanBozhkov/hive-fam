import { getBaseUrl } from "./common";

export const formatTicketSignedUrls = (domain: string, ticketIds: string[]) =>
  ticketIds.map((id) => getTicketSignedUrl(domain, id));

// for BE tickets
export const getTicketSignedUrl = (domain: string, ticketId: string) =>
  `${domain}/validate/${ticketId}`;

// for FE sharing
export const getTicketShareUrl = (ticketId: string) =>
  `${getBaseUrl(false)}/order/ticket/${ticketId}`;
