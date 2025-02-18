"use client";
import usePreviewSettingsStore from "@/zustand/previewSettings";

export const BGTemplate = ({
  bg,
  bgColor,
}: {
  bg: string | null;
  bgColor: string | null;
}) => {
  const { previewBG, previewBGColor } = usePreviewSettingsStore();
  const currentBG = previewBG ?? bg;
  const currentBGColor = previewBGColor ?? bgColor;

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-0`}
        style={{
          backgroundColor: currentBGColor ?? "black",
        }}
      />
      <div
        className={`bg-fit pointer-events-none fixed inset-0 z-0`}
        style={{
          ...(currentBG && {
            backgroundImage: `url('/assets/bgs/${currentBG}')`,
            backgroundRepeat: "repeat",
            opacity: 0.3,
          }),
        }}
      />
    </>
  );
};
