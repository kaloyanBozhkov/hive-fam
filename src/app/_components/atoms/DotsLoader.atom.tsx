import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const dots = cva("", {
  variants: {
    modifier: {
      primary: ["bg-white"],
      primaryBordered: [
        "bg-white -mb-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.5)]",
      ],
      secondary: ["bg-black"],
      tertiary: ["bg-neutral-550"],
    },
    size: {
      xs: ["-m-x-2 scale-[0.65]"],
      sm: ["-m-x-4 scale-[0.7]"],
      md: ["-m-x-4 scale-[0.8]"],
      lg: ["-m-x-4 scale-[1]"],
      xl: ["-m-x-4 scale-[1.05]"],
      xxl: ["-m-x-4 scale-[1.1]"],
    },
  },
});

type DotsVariants = VariantProps<typeof dots>;

export type DotsLoaderProps = {
  dotsBg?: string;
  className?: string;
} & DotsVariants;

const DotsLoader = ({ size, dotsBg, modifier, className }: DotsLoaderProps) => {
  const sizeStyles = dots({ size }),
    dotStyle = `absolute top-0 h-[13px] w-[13px] rounded-full ${dotsBg ?? dots({ modifier })}`;

  return (
    <div
      className={twMerge(
        "relative z-0 -ml-1 -mr-1 h-[13px] w-[80px]",
        sizeStyles,
        className,
      )}
    >
      <div
        className={twMerge(
          "left-[8px] z-[1] animate-[scale-in_0.6s_infinite]",
          dotStyle,
        )}
      />
      <div
        className={twMerge(
          "left-[8px] animate-[move-24px_0.6s_infinite]",
          dotStyle,
        )}
      />
      <div
        className={twMerge(
          "left-[32px] z-[2] animate-[move-24px_0.6s_infinite]",
          dotStyle,
        )}
      />
      <div
        className={twMerge(
          "left-[56px] z-[1] animate-[scale-out_0.6s_infinite]",
          dotStyle,
        )}
      />
    </div>
  );
};

export default DotsLoader;
