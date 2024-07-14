import { useEffect, useRef } from "react";

interface UseSlideEventsProps {
  onSlideLeft: () => void;
  onSlideRight: () => void;
  slideTreshold?: number;
}

const useSlideEvents = <T extends HTMLElement>({
  onSlideLeft,
  onSlideRight,
  slideTreshold = 5,
}: UseSlideEventsProps) => {
  const ref = useRef<T>(null);
  const startXRef = useRef<number | null>(null);
  const isTouchEventRef = useRef<boolean>(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (typeof e.touches[0] === "undefined") return;
      isTouchEventRef.current = true;
      startXRef.current = e.touches[0].clientX;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isTouchEventRef.current = false;
      startXRef.current = e.clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !isTouchEventRef.current ||
        startXRef.current === null ||
        typeof e.touches[0] === "undefined"
      )
        return;
      const endX = e.touches[0].clientX;
      handleSlide(endX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchEventRef.current || startXRef.current === null) return;
      const endX = e.clientX;
      handleSlide(endX);
    };

    const handleSlide = (endX: number) => {
      const startX = startXRef.current!;

      const diffX = startX - endX;

      // Detect a horizontal swipe only
      if (diffX > slideTreshold) {
        onSlideLeft();
      } else if (diffX < -slideTreshold) {
        onSlideRight();
      }

      // Reset the starting coordinates
      startXRef.current = null;
    };

    const handleTouchEnd = () => {
      isTouchEventRef.current = false;
    };

    const handleMouseUp = () => {
      if (!isTouchEventRef.current) {
        startXRef.current = null;
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("touchmove", handleTouchMove);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("touchend", handleTouchEnd);
      element.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (element) {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("touchend", handleTouchEnd);
        element.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [onSlideLeft, onSlideRight, slideTreshold, ref]);

  return ref;
};

export default useSlideEvents;
