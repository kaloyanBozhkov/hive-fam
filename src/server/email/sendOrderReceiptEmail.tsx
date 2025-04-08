import type { CustomerDetails } from "@/pages/api/stripe/webhook";
import { db } from "../db";
import { render } from "@react-email/components";
import { getDomainFromOrgId } from "../config";
import { format } from "date-fns";
import OrderCompletedEmail from "@/app/_components/emails/OrderComplete.email";
import { sendEmail } from "./send";
import { formatDateToTimezone } from "@/utils/fe";

export async function sendOrderReceiptEmail({
  customerDetails,
  orderSessionId,
  eventId,
}: {
  customerDetails: Partial<CustomerDetails> &
    Pick<CustomerDetails, "email" | "name">;
  orderSessionId: string;
  eventId: string;
}) {
  const {
    organization_id: orgId,
    sold_tickets,
    organization,
    ...event
  } = await db.event.findFirstOrThrow({
    where: {
      id: eventId,
    },
    select: {
      title: true,
      date: true,
      time_zone: true,
      is_free: true,
      organization_id: true,
      organization: {
        select: {
          name: true,
          brand_logo_data_url: true,
        },
      },
      sold_tickets: {
        where: {
          order_session_id: orderSessionId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!orgId || !organization) throw Error("Event has no org id");
  if (!sold_tickets.length) throw Error("No ticket found");

  const orgName = organization.name;
  const orgUrl = getDomainFromOrgId(orgId)!;
  const orderPageUrl = `${orgUrl}/order/${orderSessionId}`;
  console.log(
    "organization.brand_logo_data_url",
    organization.brand_logo_data_url,
  );
  const emailHtml = await render(
    <OrderCompletedEmail
      organisationName={orgName}
      orderPageUrl={orderPageUrl}
      ticketCount={sold_tickets.length}
      eventName={event.title}
      eventDate={format(
        formatDateToTimezone(event.date, event.time_zone),
        "PPp",
      )}
      eventUrl={`${orgUrl}/event/${eventId}?as=view`}
      platformUrl={orgUrl}
      brandLogoUrl={organization.brand_logo_data_url}
      isEventFree={event.is_free}
    />,
  );

  const info = await sendEmail({
    from: `Event Tickets | ${organization.name} <tickets@eventrave.com>`,
    to: customerDetails.email,
    subject: `Order Receipt from ${orgName}`,
    html: emailHtml,
  });

  console.log(
    "Message sent: %s",
    info.data?.id ?? info.error?.message ?? info.error?.name,
  );
}
