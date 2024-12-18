import { getBaseUrl } from "./common";

export const formatTicketSignedUrls = (ticketIds: string[]) =>
  ticketIds.map(getTicketSignedUrl);
export const getTicketSignedUrl = (ticketId: string) =>
  `${getBaseUrl()}/validate/${ticketId}`;
export const getTicketShareUrl = (ticketId: string) =>
  `${getBaseUrl()}/order/ticket/${ticketId}`;
