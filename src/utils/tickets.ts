import { getBaseUrl } from "./common";

export const formatTicketSignedUrls = (ticketIds: string[]) =>
  ticketIds.map(getTicketSignedUrl);
export const getTicketSignedUrl = (ticketId: string) =>
  `${getBaseUrl()}/api/ticket/validate/${ticketId}}`;

export const getTicketShareUrl = (ticketId: string) =>
  `${getBaseUrl()}/order/ticket/${ticketId}`;
