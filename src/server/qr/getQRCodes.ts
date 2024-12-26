import { fetchPostJSON } from "@/utils/common";
import { getOrgId } from "../actions/org";
import { DOMAIN_CONFIG } from "../config";

export const getQRCodes = async (contents: string[]) => {
  const orgId = await getOrgId();
  const qrs = contents.map((urlContent) => ({ urlContent }));
  const orgDomain = Object.entries(DOMAIN_CONFIG).find(
    ([, id]) => id === orgId,
  )?.[0];
  return fetchPostJSON(`https://${orgDomain}/api/qr/getQRCodes`, {
    qrs,
    orgId,
  });
};
