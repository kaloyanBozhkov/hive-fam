import Albums from "./_components/organisms/Albums.organism";
import Stack from "./_components/layouts/Stack.layout";
import Group from "./_components/layouts/Group.layout";

import DrawerMenu from "./_components/organisms/DrawerMenu.organism";
import Events from "./_components/organisms/Events.organism";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="grid-page min-h-screen w-full pb-4">
      <Group className="w-full items-center justify-between p-4">
        <Link href="/">
          <h1 className="pointer font-rex-bold text-[30px] leading-[110%] text-white">
            HiveFam
          </h1>
        </Link>
        <DrawerMenu />
      </Group>
      <div className="full-width mb-4 h-[420px] overflow-hidden border-y-[1px] border-white sm:h-[600px]">
        <Albums />
      </div>
      <Stack className="min-h-[400px] gap-4">
        <Events />
      </Stack>
    </div>
  );
}
