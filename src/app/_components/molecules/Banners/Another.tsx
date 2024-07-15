import Image from "next/image";
import VideoPlay from "../VideoPlay.molecule";
import Banner from "../../templates/Banner.template";

const Another = () => {
  return (
    <div className="relative z-0 h-full w-full">
      <Banner
        subtitle="Live. Vibe. 100%"
        title="Another Title Here With Cool Stuff"
        body={
          <>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </>
        }
      />
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        <VideoPlay src="/assets/party2.mp4" />
        <Image
          src="/assets/party2.png"
          alt="party"
          width={1920}
          height={1280}
          className="h-full object-cover object-center"
          priority
        />
      </div>
    </div>
  );
};

export default Another;
