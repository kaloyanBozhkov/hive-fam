"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const VideoPlay = ({ className, src }: { className?: string; src: string }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <video
      preload="metadata"
      autoPlay
      loop
      muted
      playsInline
      className={twMerge(
        `z-10 h-full w-full object-cover object-center ${isVideoLoaded ? "" : "hidden"}`,
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
