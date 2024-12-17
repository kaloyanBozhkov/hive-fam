import Stack from "@/app/_components/layouts/Stack.layout";
import { BannerList } from "./table";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";

const getBanners = async () => {
  const user = await getJWTUser();
  if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
    throw Error("Unauthorized");

  const banners = await db.banner_slide.findMany({
    where: {
      organization_id: user.organization_id,
    },
    include: {
      info_slide: {
        select: {
          title: true,
          subtitle: true,
        },
      },
      album_slide: {
        select: {
          album_name: true,
          album_subtitle: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return banners;
};

export default async function BannerListPage() {
  const data = await getBanners();
  return (
    <Stack className="gap-4">
      <Stack className="align-between w-full justify-between gap-4 md:flex-row">
        <h2 className="text-xl font-semibold">Banner Slides</h2>
        <Stack className="gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/staff/manage/admin/add-banner/info">
              Add Info Banner
            </Link>
          </Button>
          <Button asChild>
            <Link href="/staff/manage/admin/add-banner/album">
              Add Album Banner
            </Link>
          </Button>
        </Stack>
      </Stack>
      <BannerList data={data} />
    </Stack>
  );
}
