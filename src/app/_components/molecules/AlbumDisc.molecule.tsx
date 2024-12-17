"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import AlbumCover from "../atoms/AlbumCover.atom";
import Disc from "../atoms/Disc.atom";

const AlbumDisc = ({
  className = "",
  albumImg,
  albumLink,
  onlyDisc = false,
  initialOpened = false,
}: {
  className?: string;
  albumImg: string;
  albumLink: string;
  initialOpened?: boolean;
  onlyDisc?: boolean;
}) => {
  const [opened, setOpened] = useState(initialOpened);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setOpened(initialOpened);
  }, [initialOpened]);

  useEffect(() => {
    if (!clicked) return;
    const id = setTimeout(() => {
      window.open(albumLink, "_blank");
      setClicked(false);
    }, 800);

    return () => clearTimeout(id);
  }, [clicked, albumLink]);

  return (
    <div
      className={twMerge("group relative cursor-pointer", className)}
      onClick={() => {
        setClicked(true);
      }}
    >
      <div
        className={twMerge(
          opened ? "translate-x-[-15%] duration-1000" : "duration-500",
          initialOpened ? "delay-700" : "",
        )}
      >
        {onlyDisc ? (
          <div className="h-[200px] w-[200px] hover:scale-[99%] sm:h-[300px] sm:w-[300px]" />
        ) : (
          <AlbumCover
            img={albumImg}
            className={twMerge(
              "z-10",
              opened
                ? "group-hover:translate-x-[-15%] group-hover:translate-y-[3%] group-hover:rotate-[-3deg]"
                : "",
            )}
          />
        )}
        <div
          className={twMerge(
            clicked && !onlyDisc ? "translate-x-[55%]" : "",
            clicked && onlyDisc ? "scale-90" : "",
            "absolute inset-0 -z-10 transition-all ease-in-out",
            opened ? "translate-x-[45%] duration-1000" : "duration-500",
            initialOpened ? "delay-700" : "",
          )}
        >
          <Disc
            coverImgSrc={albumImg}
            className={twMerge(
              opened ? "group-hover:pause" : "",
              "w-[95%]",
              clicked && onlyDisc ? "pause" : "",
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumDisc;
