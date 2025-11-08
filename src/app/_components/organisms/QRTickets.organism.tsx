"use client";

import Stack from "../layouts/Stack.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn/Card.shadcn";
import { getTicketShareUrl } from "@/utils/tickets";
import { ButtonCopy } from "../molecules/CopyButton.moleule";
import { DownloadButton } from "../molecules/DownloadButton.molecule";
import { EventInfoCard } from "../molecules/EventInfoCard.molecule";
import Group from "../layouts/Group.layout";

const QRTickets = ({
  qrCodes,
  withShare = true,
  tickets,
  eventName,
  eventDate,
  eventLocation,
  eventEndDate,
  eventTimeZone
}: {
  qrCodes: {
    dataURL: string;
  }[];
  tickets: { id: string; ticketNumber: number; ticketType: string }[];
  withShare?: boolean;
  eventName: string;
  eventDate: Date;
  eventLocation?: string;
  eventEndDate?: Date | null;
  eventTimeZone?: string | null;
}) => {
  return (
    <Stack className="gap-4">
      {qrCodes.map(({ dataURL }, idx) => {
        const id = `ticket-${tickets[idx]!.ticketNumber}`;
        return (
          <Card key={idx} id={id}>
            <CardHeader>
              <CardTitle>
                <Group className="items-center justify-between gap-2">
                  <p className="text-[18px] font-light">
                    #{tickets[idx]!.ticketNumber} Ticket
                  </p>
                  <p className="text-[14px] font-light text-gray-500">
                    {tickets[idx]!.id}
                  </p>
                </Group>
                <p className="text-[22px] font-semibold">
                  {tickets[idx]!.ticketType}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex w-full flex-col gap-8 sm:flex-row">
              <Stack className="w-fit gap-2">
                <img
                  className="w-full max-w-[400px]"
                  src={dataURL}
                  alt={`Ticket #${idx + 1} [${tickets[idx]!.ticketType}]`}
                />
                <div data-print="hide-info">
                  <EventInfoCard
                    withCardWrapper
                    className="my-4 max-w-[400px]"
                    eventName={eventName}
                    eventDate={eventDate}
                    eventEndDate={eventEndDate}
                    eventLocation={eventLocation}
                    eventTimeZone={eventTimeZone}
                  />
                </div>
                {withShare && (
                  <ButtonCopy
                    data-print="hide-copy"
                    value={getTicketShareUrl(tickets[idx]!.id)}
                  />
                )}
                <DownloadButton
                  selector={`#${id}`}
                  fileName={`ticket-${tickets[idx]!.ticketNumber}`}
                  variant={withShare ? "secondary" : "default"}
                  className={withShare ? "shadow-md" : ""}
                  alsoHideSelector="[data-print='hide-info'], [data-print='hide-copy']"
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default QRTickets;
