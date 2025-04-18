"use client";
import usePreviewSettingsStore from "@/zustand/previewSettings";
import { useLayoutEffect } from "react";
import type { organization } from "@prisma/client";

// todo pass less data
export const BGTemplate = ({ org }: { org: organization }) => {
  const {
    previewBG,
    previewBGColor,
    previewBGOpacity,
    previewBGSize,
    setInitialSettings,
  } = usePreviewSettingsStore();

  const currentBG = previewBG ?? org.bg_image;
  const currentBGColor = previewBGColor ?? org.bg_color;
  const currentBGOpacity = previewBGOpacity ?? org.bg_opacity;
  const currentBGSize = previewBGSize ?? org.bg_size;

  useLayoutEffect(() => {
    setInitialSettings(org);
  }, [org, setInitialSettings]);

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
            backgroundSize: currentBGSize,
            opacity: currentBGOpacity,
          }),
        }}
      />
    </>
  );
};
