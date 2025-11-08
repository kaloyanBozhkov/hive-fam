import Stack from "../layouts/Stack.layout";
import DateCard from "./DateCard.molecule";
import { twMerge } from "tailwind-merge";
import Group from "../layouts/Group.layout";
import { Card, CardContent } from "../shadcn/Card.shadcn";
import { getDisplayDateFormatter } from "@/utils/fe";

export const EventInfoCard = ({
  className,
  eventName,
  eventDate,
  eventEndDate,
  eventLocation,
  eventTimeZone,
  eventVenueName,
  withCardWrapper = false,
}: {
  eventName: string;
  eventDate: Date;
  eventEndDate?: Date | null;
  eventLocation?: string;
  eventTimeZone?: string | null;
  className?: string;
  withCardWrapper?: boolean;
  eventVenueName?: string;
}) => {
  // Function to format the date range
  const formatEventDate = (startDate: Date, endDate: Date) => {
    const format = getDisplayDateFormatter(eventTimeZone);
    const startDateFormatted = format.format(startDate);
    const endDateFormatted = format.format(endDate);
    return `${startDateFormatted} - ${endDateFormatted}`;
  };

  const content = (
    <Group
      className={twMerge(
        "items-center gap-3",
        withCardWrapper ? "" : className,
      )}
    >
      <DateCard
        date={eventDate}
        timeZone={eventTimeZone}
        className="mb-0 size-[40px] min-w-[40px] items-center justify-center p-0"
        dateClassName="text-[22px] leading-[100%]"
        monthClassName="text-[14px] leading-[100%]"
      />
      <Stack className="flex-1 items-start gap-[2px] text-left">
        <p className="text-lg font-semibold leading-[100%]">{eventName}</p>
        <p className="text-[13px] font-light text-gray-500">
          {formatEventDate(
            eventDate,
            eventEndDate ?? new Date(eventDate.getTime() + 7 * 60 * 60 * 1000),
          )}
        </p>
        {eventVenueName && (
          <p className="text-[13px] font-light leading-[100%] text-gray-500">
            {eventVenueName}
          </p>
        )}
        {eventLocation && (
          <p className="text-[13px] font-light leading-[100%] text-gray-500">
            {eventLocation}
          </p>
        )}
      </Stack>
    </Group>
  );

  if (!withCardWrapper) return content;

  return (
    <Card className={twMerge("p-4", className)}>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
};
