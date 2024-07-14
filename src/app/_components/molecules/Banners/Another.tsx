import Image from "next/image";
import Stack from "../../layouts/Stack.layout";
import VideoPlay from "../VideoPlay.molecule";

const Another = () => {
  return (
    <div className="relative z-0 h-full w-full">
      <div className="grid-page z-10 h-full w-full bg-[rgb(0,0,0,0.5)] py-[20px]">
        <div className="my-[20px] h-[1px] w-full bg-white" />
        <div className="grid auto-rows-min grid-cols-1 gap-[14px] md:grid-cols-3">
          <p className="font-regular p-text text-white">
            Everywhere. Fun. Love.
          </p>
          <Stack className="col-span-2 gap-[24px]">
            <h1 className="h1-0 font-bold text-white">
              Some other banner carousel item title
            </h1>
            <p className="p-text font-light text-white">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </Stack>
        </div>
      </div>
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
