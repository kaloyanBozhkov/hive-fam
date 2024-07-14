import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";

const DateCard = ({
  className = "",
  date,
}: {
  date: Date;
  className?: string;
}) => {
  return (
    <Stack
      className={twMerge(
        "min-w-[60px] items-center rounded-md bg-green-800 p-2",
        className,
      )}
    >
      <p className="font-rex-bold text-[16px] leading-[105%] text-white/90">
        {getMonthAbr(date)}
      </p>
      <p className="font-rex-bold text-[30px] leading-[105%] text-white">
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
