import { redirect } from "next/navigation";
import Stack from "../../_components/layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../_components/shadcn/Card.shadcn";
import { Button } from "../../_components/shadcn/Button.shadcn";
import Group from "@/app/_components/layouts/Group.layout";
import { DownloadButton } from "@/app/_components/molecules/DownloadButton.molecule";
import QRTicketsServer from "@/app/_components/next-components/QRTickets.server";
import { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DotsLoader from "@/app/_components/atoms/DotsLoader.atom";
import { getOrderTickets } from "@/server/actions/getOrderTickets";

export default async function OrderPage({
  params,
}: {
  params: Promise<{
    sessionId: string;
  }>;
}) {
  const { sessionId } = await params;
  if (!sessionId) return redirect("/error");

  const { tickets, ownerEmail, eventTitle, eventId } =
    await getOrderTickets(sessionId);
  if (!tickets.length) return redirect("/error");

  const isSingleTicket = tickets.length === 1;
  const ticketWord = isSingleTicket ? "ticket" : "tickets";
  const isFreeTickets = tickets.some((t) => t.isFree);

  return (
    <Stack className="gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {isFreeTickets
              ? "Your tickets are ready"
              : "Your order is complete"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="gap-4">
            <p>
              {isFreeTickets
                ? "You claimed your tickets successfully 🎉"
                : "Your order has been processed successfully 🎉"}
              <br />
              We&apos;ve emailed the {ticketWord} to <b> {ownerEmail} </b>
            </p>
            <Group className="max-w-[350px] flex-col gap-4 sm:flex-row">
              <DownloadButton
                selector="#tickets"
                label={`Download ${ticketWord}`}
                fileName={`${eventTitle ?? "event"}-${ticketWord}`}
                alsoHideSelector="[data-print='hide-info'], [data-print='hide-copy'], button"
              />
              <Button className="w-full shadow-md" variant="secondary">
                <Group className="items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                  <span>See Event</span>
                </Group>
              </Button>
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
                  <p>Getting your tickets..</p>
                </Stack>
              </CardHeader>
            </Card>
          </Stack>
        }
      >
        <div id="tickets">
          <QRTicketsServer tickets={tickets} eventId={eventId} />
        </div>
      </Suspense>
    </Stack>
  );
}

//http://localhost:3000/order/cs_test_b1Qm7aVvvf4tHmGMuhNn8dP7WCAIDb0DCaRsEOfLH6nnLCmSnHLzEag8Qs

// unused as we rel on db now
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
