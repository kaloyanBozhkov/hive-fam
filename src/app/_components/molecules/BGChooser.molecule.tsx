"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = BGS.indexOf(selectedBg);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") nextIndex = currentIndex + 1;
      else if (e.key === "ArrowLeft") nextIndex = currentIndex - 1;
      else if (e.key === "ArrowDown") nextIndex = currentIndex + 2;
      else if (e.key === "ArrowUp") nextIndex = currentIndex - 2;
      else return;

      if (nextIndex >= 0 && nextIndex < BGS.length) {
        e.preventDefault();
        onSelect(BGS[nextIndex]!);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBg, onSelect]);

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
