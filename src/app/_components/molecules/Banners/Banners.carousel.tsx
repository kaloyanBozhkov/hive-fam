"use client";
import { twMerge } from "tailwind-merge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/shadcn/Carousel.shadcn";
import { useEffect, useMemo, useState } from "react";
import SlideDots from "../../atoms/SlideDots.atom";
import InfoBanner from "./Info.banner";
import { AlbumBanner } from "./Album.banner";

export type BannerSlide =
  | {
      type: "INFO";
      subtitle: string;
      title: string;
      content: string;
      bgSrc: string;
      bgVideoSrc?: string;
      actionParticipantsForEventId?: string;
      actionParticipantsForEventButtonText?: string;
      secondaryActionButtonText?: string;
    }
  | {
      type: "ALBUM";
      link: string;
      coverSrc: string;
      albumName: string;
      albumSubtitle: string;
      isSingle: boolean;
      actionParticipantsForEventId?: string;
      actionParticipantsForEventButtonText?: string;
      secondaryActionButtonText?: string;
    };

const Banners = ({
  className,
  slides,
}: {
  className?: string;
  slides: BannerSlide[];
}) => {
  const [active, setActive] = useState(0);
  const [startAnim, setStartAnim] = useState(false);

  const slideContent = useMemo(
    () =>
      slides.map((slide, idx) => {
        switch (slide.type) {
          case "ALBUM":
            return (
              <AlbumBanner
                {...slide}
                name={slide.albumName}
                subtitle={slide.albumSubtitle}
                idx={idx}
                startAnim={startAnim}
                active={active}
              />
            );
          case "INFO":
            return (
              <InfoBanner
                title={slide.title}
                subtitle={slide.subtitle}
                content={slide.content}
                backgroundSrc={slide.bgSrc}
                bgVideoSrc={slide.bgVideoSrc}
                actionParticipantsForEventId={
                  slide.actionParticipantsForEventId
                }
                actionParticipantsForEventButtonText={
                  slide.actionParticipantsForEventButtonText
                }
                secondaryActionButtonText={slide.secondaryActionButtonText}
              />
            );
          default:
            return `-`;
        }
      }),
    [slides],
  );

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
          opts={{ duration: 50, loop: true }}
        >
          <CarouselContent className="h-full w-full">
            {slideContent.map((slide, idx) => (
              <CarouselItem key={idx} className="h-full">
                {slide}
              </CarouselItem>
            ))}
          </CarouselContent>
          {slides.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-[20px] z-10 -sm:hidden" />
              <CarouselNext className="absolute right-[20px] z-10 -sm:hidden" />
            </>
          )}
        </Carousel>
      </div>
      {slides.length > 1 && (
        <SlideDots
          count={slides.length}
          active={active}
          onClick={setActive}
          className="absolute bottom-[20px] left-0 right-0 "
        />
      )}
    </div>
  );
};

export default Banners;
