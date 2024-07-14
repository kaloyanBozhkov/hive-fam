import { twMerge } from "tailwind-merge";

import Image from "next/image";
import Banners from "./Banners/Banners.carousel";

const LandingBanner = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge("relative h-full w-full", className)}>
      <Banners />
      <Image
        src="/assets/party1.png"
        alt="party"
        width={1920}
        height={1280}
        className="absolute h-full object-cover object-center"
        priority
      />
    </div>
  );
};

export default LandingBanner;
