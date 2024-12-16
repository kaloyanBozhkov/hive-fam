import Center from "../../layouts/Center.layout";
import Stack from "../../layouts/Stack.layout";
import Main from "../../templates/Main.template";
import AlbumDisc from "../AlbumDisc.molecule";

export const AlbumBanner = ({
  discPrintSrc,
  coverSrc,
  idx,
  active,
  startAnim,
}: {
  coverSrc?: string;
  link: string;
  discPrintSrc: string;
  idx: number;
  active: number;
  startAnim: boolean;
}) => {
  const isAlbum = Boolean(coverSrc);

  return (
    <Main className="relative h-full w-full" bgImage={discPrintSrc}>
      <Center className="h-full w-full pb-[20px]">
        <Stack className="gap-4">
          <Stack className="gap-0">
            <p className="font-rex-bold text-[16px] text-white">{type}</p>
            <h1 className="font-rex-bold text-[30px] leading-[110%] text-white">
              {name}
            </h1>
          </Stack>
          <AlbumDisc
            albumImg={coverSrc}
            albumLink={link}
            className="animate-breathe"
            onlyDisc={!isAlbum}
            initialOpened={isAlbum && idx === active && startAnim}
          />
        </Stack>
      </Center>
    </Main>
  );
};
