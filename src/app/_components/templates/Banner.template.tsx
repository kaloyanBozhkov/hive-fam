import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";
import Stack from "../layouts/Stack.layout";

const Banner = ({
  title,
  body,
  subtitle,
  className = "",
}: {
  title: ReactNode;
  body: ReactNode;
  subtitle: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "grid-page z-10 h-full w-full bg-[rgb(0,0,0,0.5)] px-[46px] py-[20px] lg:px-0 -sm:!grid-rows-[unset] -sm:items-center",
        className,
      )}
    >
      <div className="my-[20px] hidden h-[1px] w-full bg-white md:block" />
      <div className="grid grid-cols-1 sm:auto-rows-min sm:items-start md:grid-cols-3">
        <p className="font-regular p-text text-white">{subtitle}</p>
        <Stack className="col-span-2 gap-[24px]">
          <h1 className="h1-0 font-bold capitalize text-white">{title}</h1>
          <p className="p-text font-light text-white">{body}</p>
        </Stack>
      </div>
    </div>
  );
};

export default Banner;
