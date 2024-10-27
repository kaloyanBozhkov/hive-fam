import { fetchPostJSON, getBaseUrl } from "@/utils/common";
import { getOrgId } from "../actions/org";

export const getQRCodes = async (contents: string[]) => {
  const orgId = await getOrgId();
  const qrs = contents.map((urlContent) => ({ urlContent }));
  return fetchPostJSON(`${getBaseUrl()}/api/qr/getQRCodes`, { qrs, orgId });
};
