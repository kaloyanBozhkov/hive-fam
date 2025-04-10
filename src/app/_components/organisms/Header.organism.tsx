import Group from "@/app/_components/layouts/Group.layout";
import DrawerMenu from "@/app/_components/organisms/DrawerMenu.organism";
import { getOrgId } from "@/server/actions/org";
import { getUserRole } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import Link from "next/link";

const getSocialLinks = async () => {
  const organizationId = await getOrgId();
  return db.link.findMany({
    select: {
      url: true,
      name: true,
      type: true,
    },
    where: {
      organization_id: organizationId,
    },
  });
};

const Header = async ({ brandName }: { brandName: string }) => {
  const socialLinks = await getSocialLinks();
  const userRole = (await getUserRole()) ?? undefined;

  return (
    <Group className="w-full items-center justify-between px-[10px] py-4">
      <Link href="/">
        <h1 className="pointer notranslate font-rex-bold text-[30px] leading-[110%] text-white">
          {brandName}
        </h1>
      </Link>
      <DrawerMenu socialLinks={socialLinks} userRole={userRole} />
    </Group>
  );
};

export default Header;
