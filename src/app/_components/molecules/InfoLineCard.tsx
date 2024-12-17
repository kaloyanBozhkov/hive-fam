import { twMerge } from "tailwind-merge";
import Group from "../layouts/Group.layout";
import LabelCard from "./LabelCard.molecule";

const InfoLineCard = ({
  className = "",
  label,
  title,
}: {
  label: string;
  className?: string;
  title: string;
}) => {
  return (
    <Group
      className={twMerge(
        "items-center gap-2 rounded-md bg-secondary",
        className,
      )}
    >
      <LabelCard label={title} className="h-full" />
      <p className="flex-1 p-2 text-right font-rex-bold text-[16px] leading-[105%] text-black/90">
        {label}
      </p>
    </Group>
  );
};

export default InfoLineCard;
