import Group from "@/app/_components/layouts/Group.layout";
import DrawerMenu from "@/app/_components/organisms/DrawerMenu.organism";
import Link from "next/link";

const Header = async ({ brandName }: { brandName: string }) => {
  return (
    <Group className="w-full items-center justify-between py-4">
      <Link href="/">
        <h1 className="pointer font-rex-bold text-[30px] leading-[110%] text-white">
          {brandName}
        </h1>
      </Link>
      <DrawerMenu />
    </Group>
  );
};

export default Header;
