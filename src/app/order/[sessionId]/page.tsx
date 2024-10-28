import { redirect } from "next/navigation";
import { isValidSessionId } from "@/pages/api/stripe/checkout_sessions/helpers/isValidSessionId";
import { retrieveSession } from "@/pages/api/stripe/checkout_sessions/helpers/retrieveSession";
import Stack from "../../_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../_components/shadcn/Card.shadcn";
import { Button } from "../../_components/shadcn/Button.shadcn";
import QRTickets from "../../_components/organisms/QRTickets.organism";
import { Suspense } from "react";
import { db } from "@/server/db";
import Group from "@/app/_components/layouts/Group.layout";
import { DownloadButton } from "@/app/_components/molecules/DownloadButton.molecule";

const getTickets = async (sessionId: string) => {
  const tickets = await db.ticket.findMany({
    where: {
      order_session_id: sessionId,
    },
    include: {
      owner: {
        select: {
          email: true,
        },
      },
      event: {
        select: {
          title: true,
        },
      },
    },
  });
  return {
    tickets: tickets.map(({ id, count }) => ({ id, count })),
    ownerEmail: tickets[0]?.owner?.email,
    eventTitle: tickets[0]?.event?.title,
  };
};

export default async function OrderPage({
  params,
}: {
  params: { sessionId?: string };
}) {
  const { sessionId } = await (params as unknown as Promise<{
    sessionId: string;
  }>);
  if (!sessionId) return redirect("/error");

  const { tickets, ownerEmail, eventTitle } = await getTickets(sessionId);
  if (!tickets.length) return redirect("/error");

  const isSingleTicket = tickets.length === 1;
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
              We&apos;ve emailed the {ticketWord} to <b> {ownerEmail} </b>
            </p>
            <Group className="max-w-[350px] flex-col gap-4 sm:flex-row">
              <DownloadButton
                selector="#tickets"
                label={`Download ${ticketWord}`}
                fileName={`${eventTitle ?? "event"}-${ticketWord}`}
                alsoHideSelector="button"
              />
              <Button className="w-full shadow-md" variant="secondary">
                See Event
              </Button>
            </Group>
          </Stack>
        </CardContent>
      </Card>
      <Suspense fallback={<p>Rendering your tickets..</p>}>
        <div id="tickets">
          <QRTickets tickets={tickets} />
        </div>
      </Suspense>
    </Stack>
  );
}

//http://localhost:3000/order/cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs

// unused as we rel on db now
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

// const formatSignedUrls = (
//   stripeOrderSession: Awaited<ReturnType<typeof retrieveSession>>,
// ) => {
//   const items = stripeOrderSession.line_items!.data;
//   return items.map(({ id }) => getSignedUrl(stripeOrderSession.id, id));
// };
