import AddAlbumBannerForm from "@/app/_components/organisms/forms/AddAlbumBanner.form";
import { addAlbumBanner } from "@/server/actions/addAlbumBanner";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";

const getCurrentMaxOrder = async () => {
  const user = await getJWTUser();
  if (!([Role.ADMIN, Role.KOKO] as Role[]).includes(user.role))
    throw Error("Unauthorized");

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

export default async function AddAlbumBannerPage() {
  const currentMaxOrder = await getCurrentMaxOrder();

  return (
    <div>
      <h1 className="mb-8 text-xl font-semibold">Add Album Banner</h1>
      <AddAlbumBannerForm
        onAdd={addAlbumBanner}
        currentMaxOrder={currentMaxOrder}
      />
    </div>
  );
}
