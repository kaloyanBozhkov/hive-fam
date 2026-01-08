import Image from "next/image";
import VideoPlay from "../VideoPlay.molecule";
import Banner from "../../templates/Banner.template";

const InfoBanner = ({
  title,
  subtitle,
  content,
  backgroundSrc,
  bgVideoSrc,
  bgImagePosition = "CENTER",
  bgVideoPosition = "CENTER",
  actionParticipantsForEventId,
  actionParticipantsForEventButtonText,
  secondaryActionButtonText,
}: {
  backgroundSrc: string;
  bgVideoSrc?: string;
  bgImagePosition?: "CENTER" | "TOP" | "BOTTOM";
  bgVideoPosition?: "CENTER" | "TOP" | "BOTTOM";
  title: string;
  subtitle?: string;
  content?: string;
  actionParticipantsForEventId?: string;
  actionParticipantsForEventButtonText?: string;
  secondaryActionButtonText?: string;
}) => {
  const imagePositionClass =
    bgImagePosition === "TOP"
      ? "object-top"
      : bgImagePosition === "BOTTOM"
        ? "object-bottom"
        : "object-center";
  return (
    <div className="relative z-0 h-full w-full">
      <Banner
        className="bg-[rgb(0,0,0,0.3)]"
        subtitle={subtitle}
        title={title}
        content={content}
        actionParticipantsForEventId={actionParticipantsForEventId}
        actionParticipantsForEventButtonText={
          actionParticipantsForEventButtonText
        }
        secondaryActionButtonText={secondaryActionButtonText}
      />
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        {bgVideoSrc && <VideoPlay src={bgVideoSrc} position={bgVideoPosition} />}
        <Image
          src={backgroundSrc}
          alt="landing banner background"
          width={1920}
          height={1280}
          className={`absolute inset-0 -z-10 m-auto h-full w-full object-cover ${imagePositionClass}`}
          priority
        />
      </div>
    </div>
  );
};

export default InfoBanner;
