"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const VideoPlay = ({
  className,
  src,
  position = "CENTER",
}: {
  className?: string;
  src: string;
  position?: "CENTER" | "TOP" | "BOTTOM";
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const positionClass =
    position === "TOP"
      ? "object-top"
      : position === "BOTTOM"
        ? "object-bottom"
        : "object-center";

  return (
    <video
      preload="metadata"
      autoPlay
      loop
      muted
      playsInline
      className={twMerge(
        `z-10 h-full w-full object-cover ${positionClass} ${isVideoLoaded ? "" : "hidden"}`,
        className,
      )}
      controls={false}
      onLoadedData={() => setIsVideoLoaded(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoPlay;
