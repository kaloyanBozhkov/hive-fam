import type Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { stripeCli } from "@/server/stripe/stripe";
import { formatAmountForStripe } from "@/server/stripe/stripe.helpers";

import { db } from "@/server/db";
import { z } from "zod";
import { Currency } from "@prisma/client";
import { S3Service } from "@/utils/s3/service";

const MIN_AMOUNT = 0.5,
  MAX_AMOUNT = 100000;

const cartItemSchema = z.object({
  eventName: z.string(),
  ticketPrice: z.number(),
  eventId: z.string(),
  ticketTypeId: z.string(),
});

const cartCheckoutSchema = z.object({
  total: z.number().min(MIN_AMOUNT).max(MAX_AMOUNT),
  currency: z.nativeEnum(Currency),
  onCancelRedirectTo: z.string().default("/"),
  items: z.array(cartItemSchema).min(1),
});

export type CartCheckoutPayloadBody = z.infer<typeof cartCheckoutSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const validatedBody = cartCheckoutSchema.parse(req.body);
      const { total, currency, items, onCancelRedirectTo } = validatedBody;
      const eventId = items[0]!.eventId;
      const event = await db.event.findUniqueOrThrow({
        where: { id: eventId },
        select: {
          price_currency: true,
          ticket_types: {
            select: {
              price: true,
              id: true,
              label: true,
              available_tickets_of_type: true,
            },
          },
          organization_id: true,
          poster_media: {
            select: {
              media: {
                select: {
                  bucket_path: true,
                  media_type: true,
                },
              },
            },
          },
          organization: {
            select: {
              brand_logo_data_url: true,
            },
          },
        },
      });

      if (event.price_currency !== currency)
        throw new Error("Currency doesn't match");

      if (
        items.some(
          (p) =>
            event.ticket_types.find((t) => t.id === p.ticketTypeId)?.price !==
            p.ticketPrice,
        )
      )
        throw new Error("Prices not matching for all items");

      // no count per ticket type as each ticket type is present N times in items array, based on count
      if (
        items.reduce((acc, ticketOfType) => {
          return acc + ticketOfType.ticketPrice;
        }, 0) !== total
      )
        throw new Error("Total doesnt match");

      const params: Stripe.Checkout.SessionCreateParams = {
          mode: "payment",
          submit_type: "pay",
          payment_method_types: ["card"],
          phone_number_collection: {
            enabled: true,
          },
          line_items: items.map((p) => ({
            price_data: {
              unit_amount: formatAmountForStripe(p.ticketPrice, currency),
              currency,
              product_data: {
                images: event.poster_media
                  .filter((m) => m.media.media_type === "IMAGE")
                  .map((m) =>
                    S3Service.getFileUrlFromFullPath(m.media.bucket_path),
                  ),
                name: `Ticket - ${p.eventName}`,
                description: event.ticket_types.find(
                  (t) => t.id === p.ticketTypeId,
                )!.label,
              },
            },
            quantity: 1,
          })),
          billing_address_collection: "auto",
          cancel_url: `${req.headers.origin!}/${onCancelRedirectTo}`,
          success_url: `${req.headers.origin!}/order/{CHECKOUT_SESSION_ID}`,
          custom_text: {
            submit: {
              message: `Ready to claim these tickets?!`,
            },
          },
          customer_creation: "always",
          allow_promotion_codes: true,
          metadata: {
            eventId,
            totalTickets: items.length,
            organizationId: event.organization_id,
            tickets: JSON.stringify(items),
          } as OrderMetadata,
        },
        checkoutSession: Stripe.Checkout.Session =
          await stripeCli.checkout.sessions.create(params);

      console.log("checkoutSession", checkoutSession);

      res.status(200).json(checkoutSession.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const orderMetadataSchema = z.object({
  eventId: z.string(),
  tickets: z.string(), //json
  organizationId: z.string().uuid(),
  totalTickets: z.number(),
});

export type OrderMetadata = z.infer<typeof orderMetadataSchema>;
