import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

const Main = ({
  children,
  bgImage,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  bgImage?: string;
}) => {
  return (
    <div
      className={twMerge("bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 z-10">{children}</div>
      <div className="inset stuff absolute z-0 h-full w-full bg-white/10 backdrop-blur-xl"></div>
    </div>
  );
};

export default Main;
