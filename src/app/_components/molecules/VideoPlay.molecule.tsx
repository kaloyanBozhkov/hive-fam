"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const VideoPlay = ({ className, src }: { className?: string; src: string }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <video
      src={src}
      preload="metadata"
      autoPlay
      loop
      muted
      className={twMerge(
        `h-full w-full object-cover object-center ${isVideoLoaded ? "" : "hidden"}`,
        className,
      )}
      controls={false}
      onLoadedData={() => setIsVideoLoaded(true)}
    />
  );
};

export default VideoPlay;
