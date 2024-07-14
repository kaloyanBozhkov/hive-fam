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
import Connecting from "./Connecting.banner";
import SlideDots from "../../atoms/SlideDots.atom";
import Another from "./Another";

const Banners = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setStartAnim(true);
    }, 500);

    return () => clearTimeout(id);
  }, []);

  const slides = [<Connecting key={0} />, <Another key={1} />];

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
            {slides.map((slide, idx) => (
              <CarouselItem key={idx} className="h-full">
                {slide}
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
