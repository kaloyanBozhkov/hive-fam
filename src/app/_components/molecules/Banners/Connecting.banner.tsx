import Image from "next/image";
import VideoPlay from "../VideoPlay.molecule";
import Banner from "../../templates/Banner.template";

const Connecting = () => {
  return (
    <div className="relative z-0 h-full w-full">
      <Banner
        className="bg-[rgb(0,0,0,0.3)]"
        subtitle="5 years of"
        title="Connecting People Through the Power of Electronic Music"
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
        <VideoPlay src="/assets/party1.mp4" />
        <Image
          src="/assets/party1.png"
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

export default Connecting;
