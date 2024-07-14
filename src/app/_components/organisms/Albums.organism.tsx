"use client";
import { useEffect, useState } from "react";
import Center from "../layouts/Center.layour";
import AlbumDisc from "../molecules/AlbumDisc.molecule";
import Main from "../templates/Main.template";
import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";
import SlideDots from "../atoms/SlideDots.atom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/shadcn/Carousel.shadcn";

const Albums = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setStartAnim(true);
    }, 500);

    return () => clearTimeout(id);
  }, []);

  return (
    <div className={twMerge("relative h-full overflow-visible", className)}>
      <div className="relative h-full w-full">
        <Carousel
          className="h-full w-full"
          onSlideChanged={setActive}
          currentSlide={active}
          opts={{ duration: 50 }}
        >
          <CarouselContent className="h-full w-full">
            {ALBUMS.map(({ name, link, cover, type }, idx) => (
              <CarouselItem key={idx} className="h-full">
                <Main
                  className="relative h-full w-full"
                  bgImage={`/assets/${cover}`}
                >
                  <Center className="h-full w-full pb-[20px]">
                    <Stack className="gap-4">
                      <Stack className="gap-0">
                        <p className="font-rex-bold text-[16px] text-white">
                          {type}
                        </p>
                        <h1 className="font-rex-bold text-[30px] leading-[110%] text-white">
                          {name}
                        </h1>
                      </Stack>
                      <AlbumDisc
                        albumImg={cover}
                        albumLink={link}
                        className="animate-breathe"
                        onlyDisc={type === "Single"}
                        initialOpened={
                          type === "Album" && idx === active && startAnim
                        }
                      />
                    </Stack>
                  </Center>
                </Main>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[20px] z-10" />
          <CarouselNext className="absolute right-[20px] z-10" />
        </Carousel>
      </div>
      <SlideDots
        count={ALBUMS.length}
        active={active}
        onClick={setActive}
        className="absolute bottom-[20px] left-0 right-0 "
      />
    </div>
  );
};

export default Albums;

const ALBUMS = [
  {
    name: "Понятия",
    cover: "cover1.jpeg",
    link: "https://open.spotify.com/album/2H2caUAqHgoiCzi22ShNIG?highlight=spotify:track:0T7b4zA5yoAvlJN4MaOh1Y",
    type: "Album",
  },
  {
    name: "The Flow",
    link: "https://open.spotify.com/album/34ffVG0hNZ5hwwKR1AW9Wd",
    cover: "flow.jpeg",
    type: "Album",
  },
  {
    name: "Кал",
    link: "https://open.spotify.com/track/0zM04bFPr8iOLPcc65wUPx",
    cover: "cover3.jpeg",
    type: "Single",
  },
];
