import type Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { stripeCli } from "@/server/stripe/stripe";
import { formatAmountForStripe } from "@/server/stripe/stripe.helpers";

import { db } from "@/server/db";
import { z } from "zod";
import { Currency } from "@prisma/client";
import { S3Service } from "@/utils/s3/service";
import { getTransferDataForPaymentIntentCheckoutSession } from "@/server/actions/stripe/getOrganisationOwnerStripeAccountId";
import { calcualteTicketPrice } from "@/utils/pricing";
import assert from "assert";

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
              tax_calculation_type: true,
              tax_percentage: true,
            },
          },
        },
      });

      if (event.price_currency !== currency)
        throw new Error("Currency doesn't match");

      assert(event.organization, "Event Organization not found");

      const taxCalculationType = event.organization.tax_calculation_type;
      const taxPercentage = event.organization.tax_percentage;
      const taxRate = taxPercentage / 100;
      const taxItem = {
        price_data: {
          unit_amount: formatAmountForStripe(
            Number((total * taxRate).toFixed(2)),
            currency,
          ),
          currency,
          product_data: {
            name: LINE_ITEM_PRODUCT_NAME_FOR_TAX,
            description: `Static tax of ${taxPercentage}%`,
            metadata: {
              is_tax_item: "true",
            } as OrderLineItemMetadata,
          },
        },
        quantity: 1,
      };

      if (
        items.some(
          (p) =>
            // validates price of ticket type with price passed from FE
            calcualteTicketPrice(
              event.ticket_types.find((t) => t.id === p.ticketTypeId)!.price,
              taxPercentage,
              taxCalculationType,
            ) !== p.ticketPrice,
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

      const uniqueItems = items.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.ticketTypeId === item.ticketTypeId),
      );

      const orgStripeAccount = await getOrgStripeAccountId(
        event.organization_id!,
      );

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        submit_type: "pay",
        payment_method_types: ["card"],
        phone_number_collection: {
          enabled: true,
        },
        line_items: [
          ...uniqueItems.map((p) => ({
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
                metadata: {
                  ticketTypeId: p.ticketTypeId,
                } as OrderLineItemMetadata,
              },
            },
            quantity: items.filter((t) => t.ticketTypeId === p.ticketTypeId)
              .length,
          })),
          ...(taxCalculationType === "TAX_ADDED_TO_PRICE_ON_CHECKOUT"
            ? [taxItem]
            : []),
        ],
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
        // discounts: // The coupon or promotion code to apply to this Session. Currently, only up to one may be specified.
        metadata: {
          eventId,
          organizationId: event.organization_id,
        } as OrderMetadata,

        // needs addres collectiont to automatically determine the tax
        // automatic_tax: {
        //   enabled: true,
        // },

        ...(await getTransferDataForPaymentIntentCheckoutSession(
          event.organization_id!,
        )),

        ...(orgStripeAccount
          ? {
              payment_intent_data: {
                on_behalf_of: orgStripeAccount,
              },
            }
          : {}),
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripeCli.checkout.sessions.create(
          params,
          orgStripeAccount
            ? {
                stripeAccount: orgStripeAccount,
              }
            : undefined,
        );

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
  organizationId: z.string().uuid(),
  totalTickets: z.number(),
});

export const orderLineItemMetadataSchema = z.object({
  ticketTypeId: z.string().optional(),
  is_tax_item: z.string().optional(),
});

export const LINE_ITEM_PRODUCT_NAME_FOR_TAX = "Tax";

export type OrderMetadata = z.infer<typeof orderMetadataSchema>;
export type OrderLineItemMetadata = z.infer<typeof orderLineItemMetadataSchema>;

const getOrgStripeAccountId = async (organizationId: string) => {
  const org = await db.staff.findFirstOrThrow({
    where: { organization_id: organizationId, is_org_owner: true },
    select: { stripe_account_id: true },
  });

  return org.stripe_account_id;
};
