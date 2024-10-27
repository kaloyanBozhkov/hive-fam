"use server";
import { cookies } from "next/headers";
import { ORG_ID_COOKIE_NAME } from "../auth/constants";
import { db } from "../db";

export const setCookie = async (org_id: string) => {
  const cookieStore = await cookies();
  cookieStore.set(ORG_ID_COOKIE_NAME, org_id);
};

export const getOrgId = async () => {
  const cookieStore = await cookies();
  let orgId = cookieStore.get(ORG_ID_COOKIE_NAME)?.value;

  // disable for not
  orgId = orgId ?? "95b5ea5b-101c-4c41-9d34-e395ba933973";

  if (!orgId) {
    throw new Error("Org ID not found");
  }
  return orgId;
};

export const getOrg = async () => {
  const orgId = await getOrgId();
  const org = await db.organization.findUnique({
    where: {
      id: orgId,
    },
  });
  return org;
};
