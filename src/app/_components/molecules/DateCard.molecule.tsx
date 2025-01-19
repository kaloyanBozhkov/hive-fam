import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";

const DateCard = ({
  className = "",
  date,
  dateClassName = "",
  monthClassName = "",
}: {
  date: Date;
  className?: string;
  dateClassName?: string;
  monthClassName?: string;
}) => {
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
        {getMonthAbr(date)}
      </p>
      <p
        className={twMerge(
          "font-rex-bold text-[30px] leading-[105%] text-white",
          dateClassName,
        )}
      >
        {date.getDate()}
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
