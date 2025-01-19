import AddInfoBannerForm from "@/app/_components/organisms/forms/AddInfoBanner.form";
import { db } from "@/server/db";
import { getOrgId } from "@/server/actions/org";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { BannerSlideType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A banner with this order already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create banner.",
  default: "An unexpected error occurred. Please try again.",
};

async function addInfoBanner(bannerData: {
  subtitle: string;
  title: string;
  content: string;
  background_data_url: string;
  background_video_url?: string | null;
  order: number;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();

    // Use a transaction to create both the info slide and banner slide
    const result = await db.$transaction(async (tx) => {
      // Create the info slide first
      const infoSlide = await tx.info_slide.create({
        data: {
          subtitle: bannerData.subtitle,
          title: bannerData.title,
          content: bannerData.content,
          background_data_url: bannerData.background_data_url,
          background_video_url: bannerData.background_video_url,
        },
      });

      // Create the banner slide with the info slide reference
      const bannerSlide = await tx.banner_slide.create({
        data: {
          type: BannerSlideType.INFO,
          order: bannerData.order,
          organization_id: user.organization_id,
          info_slide_id: infoSlide.id,
        },
      });

      return { infoSlide, bannerSlide };
    });

    revalidatePath("/staff/manage/admin/banner-list");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to add info banner:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getCurrentMaxOrder = async () => {
  const user = await isAdminOrAbove();

  const maxOrder = await db.banner_slide.findFirst({
    where: {
      organization_id: user.organization_id,
    },
    orderBy: {
      order: "desc",
    },
    select: {
      order: true,
    },
  });

  return maxOrder?.order ?? -1;
};

export default async function AddInfoBannerPage() {
  const currentMaxOrder = await getCurrentMaxOrder();
  const orgId = await getOrgId();

  return (
    <div>
      <h1 className="mb-8 text-xl font-semibold">Add Info Banner</h1>
      <AddInfoBannerForm
        onAdd={addInfoBanner}
        currentMaxOrder={currentMaxOrder}
        organizationId={orgId}
      />
    </div>
  );
}
