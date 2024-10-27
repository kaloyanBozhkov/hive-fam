import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";

const LabelCard = ({
  className = "",
  label,
}: {
  label: string;
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
        {label}
      </p>
    </Stack>
  );
};

export default LabelCard;
