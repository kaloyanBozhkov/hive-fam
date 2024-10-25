import { redirect } from "next/navigation";
import { isValidSessionId } from "@/pages/api/stripe/checkout_sessions/helpers/isValidSessionId";
import { retrieveSession } from "@/pages/api/stripe/checkout_sessions/helpers/retrieveSession";
import Stack from "../_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/shadcn/Card.shadcn";
import { Button } from "../_components/shadcn/Button.shadcn";
import QRTickets from "../_components/organisms/QRTickets.organism";
import { getBaseUrl } from "@/utils/common";
import { Suspense } from "react";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  // const sessionId = searchParams.session_id;
  // const stripeOrderSession = await retrieveSessionOrRedirect(sessionId);
  const stripeOrderSession = {
    id: "cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs",
    object: "checkout.session",
    after_expiration: null,
    allow_promotion_codes: true,
    amount_subtotal: 6000,
    amount_total: 6000,
    automatic_tax: { enabled: false, liability: null, status: null },
    billing_address_collection: "required",
    cancel_url: "http://localhost:3000//",
    client_reference_id: null,
    client_secret: null,
    consent: null,
    consent_collection: null,
    created: 1721684072,
    currency: "bgn",
    currency_conversion: null,
    custom_fields: [],
    custom_text: {
      after_submit: null,
      shipping_address: null,
      submit: { message: "Ready to claim these tickets?!" },
      terms_of_service_acceptance: null,
    },
    customer: {
      id: "cus_QWWwhnaLVLkvoC",
      object: "customer",
      address: {
        city: "asd",
        country: "BG",
        line1: "asdasd",
        line2: "asd",
        postal_code: "sad",
        state: null,
      },
      balance: 0,
      created: 1721684102,
      currency: null,
      default_source: null,
      delinquent: false,
      description: null,
      discount: null,
      email: "kaloyan@bozhkov.com",
      invoice_prefix: "576BD109",
      invoice_settings: {
        custom_fields: null,
        default_payment_method: null,
        footer: null,
        rendering_options: null,
      },
      livemode: false,
      metadata: {},
      name: "Kaloyan Bozhkov",
      phone: "+3599876543",
      preferred_locales: ["en-US"],
      shipping: null,
      tax_exempt: "none",
      test_clock: null,
    },
    customer_creation: "always",
    customer_details: {
      address: {
        city: "asd",
        country: "BG",
        line1: "asdasd",
        line2: "asd",
        postal_code: "sad",
        state: null,
      },
      email: "kaloyan@bozhkov.com",
      name: "Kaloyan Bozhkov",
      phone: "+3599876543",
      tax_exempt: "none",
      tax_ids: [],
    },
    customer_email: null,
    expires_at: 1721770472,
    invoice: null,
    invoice_creation: {
      enabled: false,
      invoice_data: {
        account_tax_ids: null,
        custom_fields: null,
        description: null,
        footer: null,
        issuer: null,
        metadata: {},
        rendering_options: null,
      },
    },
    line_items: {
      object: "list",
      data: [
        {
          id: "li_1PfTsKH9WaHIRwrZeaLDphgr",
          object: "item",
          amount_discount: 0,
          amount_subtotal: 2000,
          amount_tax: 0,
          amount_total: 2000,
          currency: "bgn",
          description: "Tiket - Hive Family 2",
          price: {
            id: "price_1PfTsKH9WaHIRwrZCHiUjJ1r",
            object: "price",
            active: false,
            billing_scheme: "per_unit",
            created: 1721684072,
            currency: "bgn",
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: {
              id: "prod_QWWwKMsIQHGq51",
              object: "product",
              active: false,
              attributes: [],
              created: 1721684072,
              default_price: null,
              description: "Regular access",
              images: [],
              livemode: false,
              marketing_features: [],
              metadata: {},
              name: "Tiket - Hive Family 2",
              package_dimensions: null,
              shippable: null,
              statement_descriptor: null,
              tax_code: null,
              type: "service",
              unit_label: null,
              updated: 1721684072,
              url: null,
            },
            recurring: null,
            tax_behavior: "unspecified",
            tiers_mode: null,
            transform_quantity: null,
            type: "one_time",
            unit_amount: 2000,
            unit_amount_decimal: "2000",
          },
          quantity: 1,
        },
        {
          id: "li_1PfTsKH9WaHIRwrZihJdpNJQ",
          object: "item",
          amount_discount: 0,
          amount_subtotal: 2000,
          amount_tax: 0,
          amount_total: 2000,
          currency: "bgn",
          description: "Tiket - Hive Family 2",
          price: {
            id: "price_1PfTsKH9WaHIRwrZG5d4WJp9",
            object: "price",
            active: false,
            billing_scheme: "per_unit",
            created: 1721684072,
            currency: "bgn",
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: {
              id: "prod_QWWwKMsIQHGq51",
              object: "product",
              active: false,
              attributes: [],
              created: 1721684072,
              default_price: null,
              description: "Regular access",
              images: [],
              livemode: false,
              marketing_features: [],
              metadata: {},
              name: "Tiket - Hive Family 2",
              package_dimensions: null,
              shippable: null,
              statement_descriptor: null,
              tax_code: null,
              type: "service",
              unit_label: null,
              updated: 1721684072,
              url: null,
            },
            recurring: null,
            tax_behavior: "unspecified",
            tiers_mode: null,
            transform_quantity: null,
            type: "one_time",
            unit_amount: 2000,
            unit_amount_decimal: "2000",
          },
          quantity: 1,
        },
        {
          id: "li_1PfTsKH9WaHIRwrZHFuXN8VN",
          object: "item",
          amount_discount: 0,
          amount_subtotal: 2000,
          amount_tax: 0,
          amount_total: 2000,
          currency: "bgn",
          description: "Tiket - Hive Family 2",
          price: {
            id: "price_1PfTsKH9WaHIRwrZ2ldtIP6J",
            object: "price",
            active: false,
            billing_scheme: "per_unit",
            created: 1721684072,
            currency: "bgn",
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: {
              id: "prod_QWWwKMsIQHGq51",
              object: "product",
              active: false,
              attributes: [],
              created: 1721684072,
              default_price: null,
              description: "Regular access",
              images: [],
              livemode: false,
              marketing_features: [],
              metadata: {},
              name: "Tiket - Hive Family 2",
              package_dimensions: null,
              shippable: null,
              statement_descriptor: null,
              tax_code: null,
              type: "service",
              unit_label: null,
              updated: 1721684072,
              url: null,
            },
            recurring: null,
            tax_behavior: "unspecified",
            tiers_mode: null,
            transform_quantity: null,
            type: "one_time",
            unit_amount: 2000,
            unit_amount_decimal: "2000",
          },
          quantity: 1,
        },
      ],
      has_more: false,
      url: "/v1/checkout/sessions/cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs/line_items",
    },
    livemode: false,
    locale: null,
    metadata: {},
    mode: "payment",
    payment_intent: "pi_3PfTsnH9WaHIRwrZ1BZZCflz",
    payment_link: null,
    payment_method_collection: "if_required",
    payment_method_configuration_details: null,
    payment_method_options: { card: { request_three_d_secure: "automatic" } },
    payment_method_types: ["card"],
    payment_status: "paid",
    phone_number_collection: { enabled: true },
    recovered_from: null,
    saved_payment_method_options: {
      allow_redisplay_filters: ["always"],
      payment_method_remove: null,
      payment_method_save: null,
    },
    setup_intent: null,
    shipping_address_collection: null,
    shipping_cost: null,
    shipping_details: null,
    shipping_options: [],
    status: "complete",
    submit_type: "pay",
    subscription: null,
    success_url: "http://localhost:3000/order?session_id={CHECKOUT_SESSION_ID}",
    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
    ui_mode: "hosted",
    url: null,
  } as Awaited<ReturnType<typeof retrieveSession>>;

  const isSingleTicket = stripeOrderSession.line_items!.data.length === 1;
  const ticketWord = isSingleTicket ? "ticket" : "tickets";

  return (
    <Stack className="gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Your order is complete</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-4">
            <p>
              Your order has been processed successfully 🎉
              <br />
              We&apos;ve emailed the {ticketWord} to{" "}
              <b> {stripeOrderSession.customer!.email!} </b>
            </p>
            <Button className="w-fit">Download {ticketWord}</Button>
          </Stack>
        </CardContent>
      </Card>
      <Suspense fallback={<p>Rendering your tickets..</p>}>
        <QRTickets contents={formatSignedUrls(stripeOrderSession)} />
      </Suspense>
    </Stack>
  );
}

//http://localhost:3000/order?session_id=cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs

const retrieveSessionOrRedirect = async (sessionId?: string | null) => {
  try {
    if (!isValidSessionId(sessionId))
      throw Error("Incorrect CheckoutSession ID.");
    const s = await retrieveSession(sessionId);
    return s;
  } catch (err) {
    return redirect("/error");
  }
};

const getSignedUrl = (sessionId: string, lineItemId: string) => {
  return `${getBaseUrl()}/api/ticket/validate?sessionId=${sessionId}&lineItemId=${lineItemId}`;
};

const formatSignedUrls = (
  stripeOrderSession: Awaited<ReturnType<typeof retrieveSession>>,
) => {
  const items = stripeOrderSession.line_items!.data;
  return items.map(({ id }) => getSignedUrl(stripeOrderSession.id, id));
};
