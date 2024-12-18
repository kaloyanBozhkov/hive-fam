"use server";
import { cookies, headers } from "next/headers";
import { ORG_ID_COOKIE_NAME } from "../auth/constants";
import { db } from "../db";
import { env } from "@/env";
import { DOMAIN_CONFIG } from "../config";

export const setCookie = async (org_id: string) => {
  const cookieStore = await cookies();
  cookieStore.set(ORG_ID_COOKIE_NAME, org_id);
};

export const getOrgId = async () => {
  const cookieStore = await cookies();
  let orgId = cookieStore.get(ORG_ID_COOKIE_NAME)?.value;

  // Get domain from request headers
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const domainName = host.split(":")[0]! as keyof typeof DOMAIN_CONFIG;
  const domainID =
    domainName in DOMAIN_CONFIG ? DOMAIN_CONFIG[domainName] : null;

  orgId = orgId ?? domainID ?? env.TMP_ORG_ID;

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
