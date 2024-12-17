import Stack from "@/app/_components/layouts/Stack.layout";
import EditInfoBannerForm from "@/app/_components/organisms/forms/EditInfoBanner.form";
import EditAlbumBannerForm from "@/app/_components/organisms/forms/EditAlbumBanner.form";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { editBanner } from "@/server/actions/editBanner";
import { notFound } from "next/navigation";
import { getOrgId } from "@/server/actions/org";

const getInitialData = async (id: string) => {
  const user = await getJWTUser();
  if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
    throw new Error("Unauthorized");

  const banner = await db.banner_slide.findUnique({
    where: {
      id,
      organization_id: user.organization_id,
    },
    include: {
      info_slide: true,
      album_slide: true,
    },
  });

  if (!banner) return null;

  if (banner.type === "INFO" && banner.info_slide) {
    return {
      id: banner.id,
      type: banner.type,
      order: banner.order,
      subtitle: banner.info_slide.subtitle,
      title: banner.info_slide.title,
      content: banner.info_slide.content,
      background_data_url: banner.info_slide.background_data_url,
      background_video_url: banner.info_slide.background_video_url,
    };
  }

  if (banner.type === "ALBUM" && banner.album_slide) {
    return {
      id: banner.id,
      type: banner.type,
      order: banner.order,
      album_name: banner.album_slide.album_name,
      album_subtitle: banner.album_slide.album_subtitle,
      link: banner.album_slide.link,
      cover_data_url: banner.album_slide.cover_data_url,
      is_single: banner.album_slide.is_single,
    };
  }

  return null;
};

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const initialData = await getInitialData((await params).id);

  if (!initialData) {
    notFound();
  }

  const orgId = await getOrgId();

  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Banner</h1>
      {initialData.type === "INFO" ? (
        <EditInfoBannerForm
          onEdit={editBanner}
          initialData={initialData}
          organizationId={orgId}
        />
      ) : (
        <EditAlbumBannerForm onEdit={editBanner} initialData={initialData} />
      )}
    </Stack>
  );
}
