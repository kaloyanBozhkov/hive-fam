import { twMerge } from "tailwind-merge";

import Image from "next/image";

const Disc = ({
  coverImgSrc,
  className = "",
}: {
  coverImgSrc?: string;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "relative h-full w-full animate-[spin_3s_infinite_linear] bg-vinyl bg-contain bg-center bg-no-repeat",
        className,
      )}
    >
      {coverImgSrc && (
        <div className="clip-circlele-44perc mask-image-circle absolute inset-[31.83%] z-10 bg-slate-400">
          <Image
            src={coverImgSrc}
            width={200}
            height={200}
            alt="cover"
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Disc;
