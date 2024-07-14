import { twMerge } from "tailwind-merge";
import Group from "../layouts/Group.layout";

const SlideDots = ({
  count,
  active,
  onClick,
  className,
}: {
  count: number;
  active: number;
  className?: string;
  onClick?: (n: number) => void;
}) => {
  return (
    <Group className={twMerge("justify-center gap-[6px]", className)}>
      {new Array(count).fill(null).map((_, idx) => (
        <div
          onClick={() => onClick?.(idx)}
          key={idx}
          className={twMerge(
            `h-[12px] w-[12px] cursor-pointer rounded-[50%] bg-white bg-opacity-50 transition-all duration-300 ease-out hover:bg-opacity-100`,
            active === idx ? "" : "opacity-50",
          )}
        />
      ))}
    </Group>
  );
};

export default SlideDots;
