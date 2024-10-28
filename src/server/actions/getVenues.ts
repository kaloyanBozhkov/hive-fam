import { getJWTUser } from "@/server/auth/getJWTUser";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

export const getVenuesData = async () => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  const data = await db.venue.findMany({
    where: {
      organization_id: user.organization_id,
    },
  });
  return data;
};
