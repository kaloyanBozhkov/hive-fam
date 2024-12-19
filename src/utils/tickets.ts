import { getBaseUrl } from "./common";

export const formatTicketSignedUrls = (ticketIds: string[]) =>
  ticketIds.map(getTicketSignedUrl);
export const getTicketSignedUrl = (ticketId: string) =>
  `${getBaseUrl(false)}/validate/${ticketId}`;
export const getTicketShareUrl = (ticketId: string) =>
  `${getBaseUrl(false)}/order/ticket/${ticketId}`;
