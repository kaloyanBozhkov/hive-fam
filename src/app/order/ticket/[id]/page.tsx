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
import InfoLineCard from "@/app/_components/molecules/InfoLineCard";

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
          venue: {
            select: {
              name: true,
              street_addr: true,
              city: true,
              country: true,
              maps_url: true,
            },
          },
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
  params: Promise<{ id: string }>;
}) {
  const { id: ticketId } = await params;
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
              <Stack className="gap-1">
                <InfoLineCard title="Event" label={ticket.event.title} />
                <Group className="flex-col gap-4 lg:flex-row">
                  <Stack className="gap-2">
                    <InfoLineCard
                      title="Time"
                      label={format(ticket.event.date, "HH:mm")}
                    />
                    <InfoLineCard
                      title="Date"
                      label={format(ticket.event.date, "dd MMMM yyyy")}
                    />
                    <InfoLineCard
                      title="Venue"
                      label={ticket.event.venue.name}
                    />
                  </Stack>
                </Group>
              </Stack>
              <Stack className="gap-2">
                <Button className="w-full sm:w-[150px]" asChild>
                  <Link href={`/event/${ticket.event.venue.maps_url}as=view`}>
                    View Location
                  </Link>
                </Button>
                <Button
                  className="w-full shadow-md sm:w-[150px]"
                  variant="secondary"
                  asChild
                >
                  <Link href={`/event/${ticket.event.id}as=view`}>
                    See Event
                  </Link>
                </Button>
              </Stack>
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
