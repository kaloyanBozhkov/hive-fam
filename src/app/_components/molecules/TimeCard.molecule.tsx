import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";
import { format } from "date-fns";
import { formatDateToTimezone } from "@/utils/fe";
import { useMemo } from "react";

const TimeCard = ({
  className = "",
  date,
  timeZone,
}: {
  date: Date;
  className?: string;
  timeZone?: string | null;
}) => {
  const formattedDate = useMemo(
    () => formatDateToTimezone(date, timeZone),
    [timeZone, date],
  );

  return (
    <Stack
      className={twMerge(
        "min-w-[60px] items-center rounded-md p-2 [background:var(--theme-primary-bg,hsl(var(--primary)))]",
        className,
      )}
    >
      <p className="notranslate font-rex-bold text-[16px] leading-[105%] [color:var(--theme-primary-text,hsl(var(--primary-foreground)))] opacity-90">
        {format(formattedDate, "HH:mm")}
      </p>
    </Stack>
  );
};

export default TimeCard;
