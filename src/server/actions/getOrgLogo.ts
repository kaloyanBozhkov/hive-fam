"use server";
import { db } from "../db";
import { getOrgId } from "./org";

export const getOrgLogo = async (orgId?: string) => {
  const organizationId = orgId ?? (await getOrgId());
  const logoDataUrl = await db.organization.findUniqueOrThrow({
    where: {
      id: organizationId,
    },
    select: {
      brand_logo_data_url: true,
    },
  });
  return logoDataUrl.brand_logo_data_url;
};
