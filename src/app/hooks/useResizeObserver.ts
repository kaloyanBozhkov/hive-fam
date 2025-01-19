import { useEffect, useState } from "react";

const useResizeObserver = (
  ref: React.RefObject<HTMLElement | SVGElement>,
  initialSize?: { width: number; height: number },
) => {
  const [dimensions, setDimensions] = useState(
    initialSize ?? { width: 0, height: 0 },
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current.parentElement!);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;
