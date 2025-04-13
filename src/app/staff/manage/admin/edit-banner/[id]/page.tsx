import Stack from "@/app/_components/layouts/Stack.layout";
import EditInfoBannerForm from "@/app/_components/organisms/forms/EditInfoBanner.form";
import EditAlbumBannerForm from "@/app/_components/organisms/forms/EditAlbumBanner.form";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getOrgId } from "@/server/actions/org";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const errorMessages: Record<string, string> = {
  P2002: "A banner with this order already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update banner.",
  default: "An unexpected error occurred. Please try again.",
};

type InfoBannerData = {
  id: string;
  type: "INFO";
  order: number;
  subtitle?: string | null;
  title: string;
  content?: string | null;
  background_data_url: string;
  background_video_url?: string | null;
  action_participants_for_event_id?: string | null;
};

type AlbumBannerData = {
  id: string;
  type: "ALBUM";
  order: number;
  album_name: string;
  album_subtitle: string;
  link: string;
  cover_data_url: string;
  is_single: boolean;
};

type BannerData = InfoBannerData | AlbumBannerData;

function isInfoBanner(banner: BannerData): banner is InfoBannerData {
  return banner.type === "INFO";
}

function isAlbumBanner(banner: BannerData): banner is AlbumBannerData {
  return banner.type === "ALBUM";
}

async function editBanner(bannerData: BannerData) {
  "use server";

  try {
    await isAdminOrAbove();

    const banner = await db.banner_slide.findUnique({
      where: { id: bannerData.id },
      include: { info_slide: true, album_slide: true },
    });

    if (!banner) throw new Error("Banner not found");

    // Use a transaction to update both the slide and banner
    const result = await db.$transaction(async (tx) => {
      if (isInfoBanner(bannerData) && banner.info_slide) {
        await tx.info_slide.update({
          where: { id: banner.info_slide.id },
          data: {
            subtitle: bannerData.subtitle,
            title: bannerData.title,
            content: bannerData.content,
            background_data_url: bannerData.background_data_url,
            background_video_url: bannerData.background_video_url,
            action_participants_for_event_id:
              bannerData.action_participants_for_event_id ?? null,
          },
        });
      } else if (isAlbumBanner(bannerData) && banner.album_slide) {
        await tx.album_slide.update({
          where: { id: banner.album_slide.id },
          data: {
            album_name: bannerData.album_name,
            album_subtitle: bannerData.album_subtitle,
            link: bannerData.link,
            cover_data_url: bannerData.cover_data_url,
            is_single: bannerData.is_single,
          },
        });
      }

      // Update banner order if changed
      if (banner.order !== bannerData.order) {
        await tx.banner_slide.update({
          where: { id: bannerData.id },
          data: { order: bannerData.order },
        });
      }
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to edit banner:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getInitialData = async (id: string) => {
  const user = await isAdminOrAbove();

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
      action_participants_for_event_id:
        banner.info_slide.action_participants_for_event_id,
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
