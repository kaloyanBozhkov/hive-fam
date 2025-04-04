"use server";
import { cookies, headers } from "next/headers";
import { ORG_ID_COOKIE_NAME } from "../auth/constants";
import { db } from "../db";
import { env } from "@/env";
import { DOMAIN_CONFIG } from "../config";
import { isKoko } from "../auth/roleGates";

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

  if (!orgId) console.warn("Org ID not found");
  return orgId;
};

export const getOrg = async (orgIdd?: string) => {
  const orgId = orgIdd ?? (await getOrgId());
  const org = await db.organization.findUniqueOrThrow({
    where: {
      id: orgId,
    },
  });
  return org;
};

export const getAllOrgs = async () => {
  await isKoko();
  const organizations = await db.organization.findMany({
    select: {
      id: true,
      name: true,
      created_at: true,
    },
  });
  return organizations;
};
