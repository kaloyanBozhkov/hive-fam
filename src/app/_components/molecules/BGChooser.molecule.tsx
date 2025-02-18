import { BGS } from "@/styles/bgs";
import Stack from "../layouts/Stack.layout";
import { twMerge } from "tailwind-merge";

export const BGChooser = ({
  onSelect,
  selectedBg,
}: {
  onSelect: (bgName: string) => void;
  selectedBg: string;
}) => {
  return (
    <Stack className="w-full gap-2">
      <div className="grid h-[400px] w-full grid-cols-2 gap-2 overflow-auto md:grid-cols-2">
        {BGS.map((bg) => (
          <div
            key={bg}
            className={twMerge(
              "h-[250px] w-[420px] max-w-full cursor-pointer bg-auto bg-center bg-repeat hover:border-2 hover:border-primary",
              selectedBg === bg && "border-2 border-primary",
            )}
            style={{ backgroundImage: `url('/assets/bgs/${bg}')` }}
            onClick={() => onSelect(bg)}
          />
        ))}
      </div>
    </Stack>
  );
};
