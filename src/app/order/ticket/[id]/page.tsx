import { redirect } from "next/navigation";
import { isValidSessionId } from "@/pages/api/stripe/checkout_sessions/helpers/isValidSessionId";
import { retrieveSession } from "@/pages/api/stripe/checkout_sessions/helpers/retrieveSession";
import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import QRTickets from "@/app/_components/organisms/QRTickets.organism";
import { Suspense } from "react";
import { db } from "@/server/db";
import { format } from "date-fns";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Group from "@/app/_components/layouts/Group.layout";
import Link from "next/link";

const getTicket = async (ticketId: string) => {
  const ticket = await db.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      owner: {
        select: {
          email: true,
          name: true,
          surname: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
        },
      },
    },
  });
  return {
    ticket,
    owner: ticket?.owner,
  };
};

export default async function TicketOrderPage({
  params,
}: {
  params: { id?: string };
}) {
  const ticketId = (await params).id;
  if (!ticketId) return redirect("/error");

  const { ticket, owner } = await getTicket(ticketId);
  if (!ticket || !owner) return redirect("/error");

  return (
    <Stack className="gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {owner.name} {owner.surname} shared a ticket with you!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-4">
            <p>
              This ticket can be scanned only once so be sure to have the right
              one.
            </p>
            <Group className="flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row">
              <p>
                This ticket is for <b>&quot;{ticket.event.title}&quot;</b>.
                <br />
                Opening: <b>{format(ticket.event.date, "HH:mm")}</b> on{" "}
                {format(ticket.event.date, "dd MMMM yyyy")}
              </p>
              <Button className="w-fit" asChild>
                <Link href={`/event/${ticket.event.id}as=view`}>See Event</Link>
              </Button>
            </Group>
          </Stack>
        </CardContent>
      </Card>
      <Suspense fallback={<p>Rendering your ticket..</p>}>
        <QRTickets
          tickets={[
            {
              id: ticket.id,
              count: ticket.count,
            },
          ]}
          withShare={false}
        />
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
