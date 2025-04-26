import { redirect } from "next/navigation";
import Stack from "@/app/_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/shadcn/Card.shadcn";
import { Suspense } from "react";
import { db } from "@/server/db";
import { format } from "date-fns";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Group from "@/app/_components/layouts/Group.layout";
import Link from "next/link";
import InfoLineCard from "@/app/_components/molecules/InfoLineCard";
import QRTicketsServer from "@/app/_components/next-components/QRTickets.server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { getOrderTickets } from "@/server/actions/getOrderTickets";
import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
import { calcualteTicketPrice } from "@/utils/pricing";
import assert from "assert";

const getTicket = async (ticketId: string) => {
  try {
    const response = await db.ticket.findUniqueOrThrow({
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
        ticket_type: {
          select: {
            label: true,
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
            organization: {
              select: {
                tax_calculation_type: true,
                tax_percentage: true,
              },
            },
          },
        },
      },
    });

    const { event, owner, ticket_type, ...ticket } = response;
    const sessionId = ticket.order_session_id;
    const { tickets } = await getOrderTickets(sessionId);
    const ticketNumber = tickets.find((t) => t.id === ticket.id)?.ticketNumber;
    if (!ticketNumber) throw new Error("Ticket number not found");

    assert(event.organization, "Event organization not found");
    const ticketPrice = calcualteTicketPrice(
      ticket.price,
      event.organization.tax_percentage,
      event.organization.tax_calculation_type,
    );

    return {
      ticket: {
        ...ticket,
        ticketNumber,
        price: ticketPrice,
      },
      owner,
      event,
      ticket_type,
    };
  } catch (err) {
    return {};
  }
};

export default async function TicketOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: ticketId } = await params;
  if (!ticketId) return redirect("/error");

  const { ticket, owner, event, ticket_type } = await getTicket(ticketId);
  if (!ticket || !owner || !event || !ticket_type) return redirect("/error");

  return (
    <Stack className="gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {owner.name}
            {owner.surname ? ` ${owner.surname}` : ""} shared a ticket with you!
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
                <InfoLineCard title="Event" label={event.title} />
                <Group className="flex-col gap-4 lg:flex-row">
                  <Stack className="gap-2">
                    <InfoLineCard
                      title="Time"
                      label={format(event.date, "HH:mm")}
                    />
                    <InfoLineCard
                      title="Date"
                      label={format(event.date, "dd MMMM yyyy")}
                    />
                    <InfoLineCard title="Venue" label={event.venue.name} />
                  </Stack>
                </Group>
              </Stack>
              <Stack className="gap-2">
                <Button className="w-full" asChild>
                  <Link href={`/event/${event.venue.maps_url}as=view`}>
                    View Location
                  </Link>
                </Button>
                <Button
                  className="w-full shadow-md"
                  variant="secondary"
                  asChild
                >
                  <Link href={`/event/${event.id}as=view`}>
                    <Group className="items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                      <span>See Event</span>
                    </Group>
                  </Link>
                </Button>
              </Stack>
            </Group>
          </Stack>
        </CardContent>
      </Card>
      <Suspense
        fallback={
          <Stack className="min-h-[400px] w-full gap-4">
            <Card className="bg-white">
              <CardHeader className="block">
                <Stack className="items-center justify-center gap-2">
                  <DotsLoader modifier="secondary" size="sm" />
                  <p>Getting your ticket..</p>
                </Stack>
              </CardHeader>
            </Card>
          </Stack>
        }
      >
        <QRTicketsServer
          tickets={[
            {
              id: ticket.id,
              ticketNumber: ticket.ticketNumber,
              ticketType: ticket_type?.label ?? "Free Entry",
            },
          ]}
          withShare={false}
          eventId={event.id}
        />
      </Suspense>
    </Stack>
  );
}

//http://localhost:3000/order/cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs

// // unused as we rel on db now
// const retrieveSessionOrRedirect = async (sessionId?: string | null) => {
//   try {
//     if (!isValidSessionId(sessionId))
//       throw Error("Incorrect CheckoutSession ID.");
//     const s = await retrieveSession(sessionId);
//     return s;
//   } catch (err) {
//     return redirect("/error");
//   }
// };

// const formatSignedUrls = (
//   stripeOrderSession: Awaited<ReturnType<typeof retrieveSession>>,
// ) => {
//   const items = stripeOrderSession.line_items!.data;
//   return items.map(({ id }) => getSignedUrl(stripeOrderSession.id, id));
// };
