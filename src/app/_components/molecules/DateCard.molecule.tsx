import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";
import { formatDateToTimezone } from "@/utils/fe";
import { useMemo } from "react";

const DateCard = ({
  className = "",
  date,
  dateClassName = "",
  monthClassName = "",
  timeZone,
}: {
  date: Date;
  className?: string;
  dateClassName?: string;
  monthClassName?: string;
  timeZone?: string | null;
}) => {
  const formattedDate = useMemo(
    () => formatDateToTimezone(date, timeZone),
    [timeZone, date],
  );
  return (
    <Stack
      className={twMerge(
        "min-w-[60px] items-center rounded-md bg-green-800 p-2",
        className,
      )}
    >
      <p
        className={twMerge(
          "font-rex-bold text-[16px] leading-[105%] text-white/90",
          monthClassName,
        )}
      >
        {getMonthAbr(formattedDate)}
      </p>
      <p
        className={twMerge(
          "font-rex-bold text-[30px] leading-[105%] text-white",
          dateClassName,
        )}
      >
        {formattedDate.getDate()}
      </p>
    </Stack>
  );
};

export default DateCard;

const getMonthAbr = (d: Date) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[d.getMonth()];
};
