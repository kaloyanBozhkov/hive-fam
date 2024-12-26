import { env } from "@/env";
import type { CustomerDetails } from "@/pages/api/stripe/webhook";
import { db } from "../db";
import { render } from "@react-email/components";
import OrderCompletedEmail from "@/app/_components/emails/orderComplete.email";
import { getDomainFromOrgId } from "../config";
import { format } from "date-fns";
import { transporter } from "../mail/nodemailer";

export async function sendOrderReceiptEmail({
  customerDetails,
  orderSessionId,
  eventId,
}: {
  customerDetails: CustomerDetails;
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
  const orgUrl = getDomainFromOrgId(orgId);
  const orderPageUrl = `${orgUrl}/order/${orderSessionId}`;

  const emailHtml = await render(
    <OrderCompletedEmail
      organisationName={orgName}
      orderPageUrl={orderPageUrl}
      ticketCount={sold_tickets.length}
      eventName={event.title}
      eventDate={format(event.date, "PPpp")}
      eventUrl={`${orgUrl}/event/${eventId}`}
      platformUrl={orgUrl}
      brandLogoUrl={organization.brand_logo_data_url}
    />,
  );

  // Send email
  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: customerDetails.email,
    subject: `Order Receipt from ${orgName}`,
    html: emailHtml,
  });

  console.log("Message sent: %s", info.messageId);
}
