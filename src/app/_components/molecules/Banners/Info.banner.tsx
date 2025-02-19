import Image from "next/image";
import VideoPlay from "../VideoPlay.molecule";
import Banner from "../../templates/Banner.template";

const InfoBanner = ({
  title,
  subtitle,
  content,
  backgroundSrc,
  bgVideoSrc,
  actionParticipantsForEventId,
}: {
  backgroundSrc: string;
  bgVideoSrc?: string;
  title: string;
  subtitle: string;
  content: string;
  actionParticipantsForEventId?: string;
}) => {
  return (
    <div className="relative z-0 h-full w-full">
      <Banner
        className="bg-[rgb(0,0,0,0.3)]"
        subtitle={subtitle}
        title={title}
        content={content}
        actionParticipantsForEventId={actionParticipantsForEventId}
      />
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        {bgVideoSrc && <VideoPlay src={bgVideoSrc} />}
        <Image
          src={backgroundSrc}
          alt="landing banner background"
          width={1920}
          height={1280}
          className="absolute inset-0 z-[5] m-auto h-full w-full object-cover object-center"
          priority
        />
      </div>
    </div>
  );
};

export default InfoBanner;
