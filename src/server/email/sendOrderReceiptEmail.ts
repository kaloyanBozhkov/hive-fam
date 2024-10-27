import nodemailer from "nodemailer";
import { env } from "@/env";
import type { CustomerDetails } from "@/pages/api/stripe/webhook";
import { getBaseUrl } from "@/utils/common";
import { db } from "../db";

export async function sendOrderReceiptEmail({
  customerDetails,
  orderSessionId,
}: {
  customerDetails: CustomerDetails;
  orderSessionId: string;
}) {
  const data = await db.ticket.findFirst({
    where: {
      order_session_id: orderSessionId,
    },
    select: {
      event: {
        select: {
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!data?.event?.organization) throw Error("No ticket found");
  const brandName = data?.event.organization.name;

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: parseInt(env.EMAIL_SERVER_PORT),
    secure: env.EMAIL_SERVER_PORT === "465", // true for 465, false for other ports
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Create email content
  const emailContent = `
    <h1>Order Receipt</h1>
    <p>Thank you for your order, ${customerDetails.name}!</p>
    
    <h2>Your tickets are available at:</h2>
    <a href="${getBaseUrl()}/order/${orderSessionId}">View Tickets</a>
    
    <p>If you have any questions, please contact us.</p>
  `;

  // Send email
  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: customerDetails.email,
    subject: `Your Order Receipt | ${brandName}`,
    html: emailContent,
  });

  console.log("Message sent: %s", info.messageId);
}
