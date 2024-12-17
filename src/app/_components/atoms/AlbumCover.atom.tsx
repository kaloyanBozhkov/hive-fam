import { twMerge } from "tailwind-merge";

const AlbumCover = ({ img, className }: { img: string; className: string }) => {
  return (
    <div
      className={twMerge(
        className,
        "h-[200px] w-[200px] shadow-lg transition-all hover:scale-[99%] hover:shadow-sm sm:h-[300px] sm:w-[300px]",
      )}
    >
      <div
        style={{ backgroundImage: `url(${img})` }}
        className="h-full w-full rounded-[4px] bg-cover"
      />
    </div>
  );
};

export default AlbumCover;
