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
  accessType: z.literal("regular").optional().default("regular"),
  eventId: z.string(),
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
          organization_id: true,
          ticket_price: true,
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

      if (items.some((p) => p.ticketPrice !== event.ticket_price))
        throw new Error("Prices not matching for all items");

      if (items.reduce((acc, p) => acc + p.ticketPrice, 0) !== total)
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
                name: `Tiket - ${p.eventName}`,
                description: "Regular access",
              },
            },
            quantity: 1,
          })),
          billing_address_collection: "required",
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
            ticketPrice: event.ticket_price,
            organizationId: event.organization_id,
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
  totalTickets: z.number(),
  ticketPrice: z.number(),
  organizationId: z.string().uuid(),
});

export type OrderMetadata = z.infer<typeof orderMetadataSchema>;
