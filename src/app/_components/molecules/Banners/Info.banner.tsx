import Image from "next/image";
import VideoPlay from "../VideoPlay.molecule";
import Banner from "../../templates/Banner.template";

const InfoBanner = ({
  title,
  subtitle,
  content,
  backgroundSrc,
  bgVideoSrc,
}: {
  backgroundSrc: string;
  bgVideoSrc?: string;
  title: string;
  subtitle: string;
  content: string;
}) => {
  return (
    <div className="relative z-0 h-full w-full">
      <Banner
        className="bg-[rgb(0,0,0,0.3)]"
        subtitle={subtitle}
        title={title}
        body={content}
      />
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        {bgVideoSrc && <VideoPlay src={bgVideoSrc} />}
        <Image
          src={backgroundSrc}
          alt="landing banner background"
          width={1920}
          height={1280}
          className="absolute inset-0 z-[5] m-auto object-cover  object-center md:w-full -md:h-full"
          priority
        />
      </div>
    </div>
  );
};

export default InfoBanner;
