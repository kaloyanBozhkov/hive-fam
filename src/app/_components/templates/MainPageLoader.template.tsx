"use client";
// import usePreviewSettingsStore from "@/zustand/previewSettings";
// import { twMerge } from "tailwind-merge";

export default function MainPageLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { initialized } = usePreviewSettingsStore();

  return (
    <>
      {children}
      {/* <div
        className={twMerge(
          "pointer-events-none fixed inset-0 z-[100] h-full w-full bg-black transition-all duration-300",
          initialized && "opacity-0",
        )}
      /> */}
    </>
  );
}
