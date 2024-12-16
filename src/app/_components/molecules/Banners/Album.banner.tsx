import Center from "../../layouts/Center.layout";
import Stack from "../../layouts/Stack.layout";
import Main from "../../templates/Main.template";
import AlbumDisc from "../AlbumDisc.molecule";

export const AlbumBanner = ({
  isSingle,
  coverSrc,
  idx,
  active,
  startAnim,
  link,
  name,
  subtitle,
}: {
  name: string;
  coverSrc: string;
  link: string;
  idx: number;
  active: number;
  startAnim: boolean;
  isSingle: boolean;
  subtitle: string;
}) => {
  const isAlbum = !isSingle;

  return (
    <Main className="relative h-full w-full" bgImage={coverSrc}>
      <Center className="h-full w-full pb-[20px]">
        <Stack className="gap-4">
          <Stack className="gap-0">
            <p className="font-rex-bold text-[16px] text-white">{subtitle}</p>
            <h1 className="font-rex-bold text-[30px] leading-[110%] text-white">
              {name}
            </h1>
          </Stack>
          <AlbumDisc
            albumImg={coverSrc}
            albumLink={link}
            className="animate-breathe"
            onlyDisc={isSingle}
            initialOpened={isAlbum && idx === active && startAnim}
          />
        </Stack>
      </Center>
    </Main>
  );
};
