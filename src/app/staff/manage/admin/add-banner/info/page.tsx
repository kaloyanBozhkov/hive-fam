import AddInfoBannerForm from "@/app/_components/organisms/forms/AddInfoBanner.form";
import { addInfoBanner } from "@/server/actions/addInfoBanner";
import { db } from "@/server/db";
import { getJWTUser } from "@/server/auth/getJWTUser";
import { Role } from "@prisma/client";
import { getOrgId } from "@/server/actions/org";

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
