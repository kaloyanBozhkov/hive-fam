import { db } from "@/server/db";
import { isManagerOrAbove } from "../auth/roleGates";

export const getVenuesData = async () => {
  const user = await isManagerOrAbove();

  const data = await db.venue.findMany({
    where: {
      organization_id: user.organization_id,
    },
  });
  return data;
};
