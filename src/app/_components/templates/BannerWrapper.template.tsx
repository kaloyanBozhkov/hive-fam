"use client";
import usePreviewSettingsStore from "@/zustand/previewSettings";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const BannerWrapper = ({ children }: { children: ReactNode }) => {
  const { largeBannersDesktop } = usePreviewSettingsStore();
  return (
    <div
      className={twMerge(
        "full-width mb-4 overflow-hidden border-y-[1px] border-white transition-all duration-300",
        largeBannersDesktop
          ? "h-[max(420px,fit-content)] md:h-[600px] lg:h-[900px]"
          : "h-[max(420px,fit-content)] md:h-[600px]",
      )}
    >
      {children}
    </div>
  );
};
