"use client";
import { twMerge } from "tailwind-merge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/shadcn/Carousel.shadcn";
import { useEffect, useState } from "react";
import SlideDots from "../../atoms/SlideDots.atom";
import InfoBanner from "./Info.banner";

export type BannerSlide =
  | {
      type: "INFO";
      subtitle: string;
      title: string;
      content: string;
      background_data_url: string;
      background_video_url?: string;
      order: number;
    }
  | {
      type: "ALBUM";
      link: string;
      cover_data_url: string;
      disc_print_data_url: string;
      order: number;
    };

const Banners = ({
  className,
  slides,
}: {
  className?: string;
  slides: BannerSlide[];
}) => {
  const [active, setActive] = useState(0);
  const [, setStartAnim] = useState(false);

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
            {slides
              .sort((a, b) => a.order - b.order)
              .map((slide, idx) => (
                <CarouselItem key={idx} className="h-full">
                  {(() => {
                    switch (slide.type) {
                      case "ALBUM":
                        return null;
                      case "INFO":
                        return (
                          <InfoBanner
                            title={slide.title}
                            subtitle={slide.subtitle}
                            content={slide.content}
                            backgroundSrc={slide.background_data_url}
                            bgVideoSrc={slide.background_video_url}
                          />
                        );
                      default:
                        return `-`;
                    }
                  })()}
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[20px] z-10" />
          <CarouselNext className="absolute right-[20px] z-10" />
        </Carousel>
      </div>
      <SlideDots
        count={slides.length}
        active={active}
        onClick={setActive}
        className="absolute bottom-[20px] left-0 right-0 "
      />
    </div>
  );
};

export default Banners;
