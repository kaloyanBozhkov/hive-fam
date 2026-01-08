import { twMerge } from "tailwind-merge";

import Banners, { type BannerSlide } from "./Banners/Banners.carousel";
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
          background_image_position: true,
          background_video_position: true,
          action_participants_for_event_id: true,
          action_participants_for_event_button_text: true,
          secondary_action_button_text: true,
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
    orderBy: {
      order: "asc",
    },
  });

  return slides
    .filter((s) => s.info_slide ?? s.album_slide)
    .map(({ info_slide, album_slide, ...slide }) => ({
      ...slide,
      ...info_slide,
      ...album_slide,
      bgVideoSrc: info_slide?.background_video_url,
      bgSrc: info_slide?.background_data_url,
      bgImagePosition: info_slide?.background_image_position,
      bgVideoPosition: info_slide?.background_video_position,
      coverSrc: album_slide?.cover_data_url,
      actionParticipantsForEventId:
        info_slide?.action_participants_for_event_id,
      actionParticipantsForEventButtonText:
        info_slide?.action_participants_for_event_button_text,
      secondaryActionButtonText: info_slide?.secondary_action_button_text,
    })) as BannerSlide[];
};

const LandingBanner = async ({ className }: { className?: string }) => {
  const slides = await getSlies();

  return (
    <div className={twMerge("relative h-full w-full", className)}>
      {slides.length > 0 ? <Banners slides={slides} /> : <Connecting />}
    </div>
  );
};

export default LandingBanner;
