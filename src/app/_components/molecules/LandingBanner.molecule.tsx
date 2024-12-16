import { twMerge } from "tailwind-merge";

import Image from "next/image";
import Banners, { BannerSlide } from "./Banners/Banners.carousel";
import { db } from "@/server/db";
import { getOrgId } from "@/server/actions/org";
import Connecting from "./Banners/Connecting.banner";

const getSlies = async () => {
  const orgId = await getOrgId();
  const slides = await db.banner_slide.findMany({
    select: {
      order: true,
      type: true,
      info_slide: {
        select: {
          title: true,
          content: true,
          subtitle: true,
          background_data_url: true,
          background_video_url: true,
        },
      },
      album_slide: {
        select: {
          cover_data_url: true,
          link: true,
          is_single: true,
          album_name: true,
          album_subtitle: true,
        },
      },
    },
    where: {
      organization_id: orgId,
    },
  });

  return slides
    .filter((s) => s.info_slide || s.album_slide)
    .map(({ info_slide, album_slide, ...slide }) => ({
      ...slide,
      ...info_slide,
      ...album_slide,
      bgVideoSrc: info_slide?.background_data_url,
      bgSrc: info_slide?.background_data_url,
      coverSrc: album_slide?.cover_data_url,
    })) as BannerSlide[];
};

const LandingBanner = async ({ className }: { className?: string }) => {
  const slides = await getSlies();
  const bg = (() => {
    switch (slides[0]?.type) {
      case "ALBUM":
        return slides[0].coverSrc;
      case "INFO":
        return slides[0].bgVideoSrc;
      default:
        return null;
    }
  })();

  return (
    <div className={twMerge("relative h-full w-full", className)}>
      {slides.length > 0 ? <Banners slides={slides} /> : <Connecting />}
      {bg && (
        <Image
          src={bg}
          alt="party"
          width={1920}
          height={1280}
          className="absolute h-full object-cover object-center"
          priority
        />
      )}
    </div>
  );
};

export default LandingBanner;
