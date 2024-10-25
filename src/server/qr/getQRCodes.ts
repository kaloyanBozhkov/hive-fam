import { fetchPostJSON, getBaseUrl } from "@/utils/common";

export const getQRCodes = async (contents: string[]) => {
  const qrs = contents.map((urlContent) => ({ urlContent }));
  return fetchPostJSON(`${getBaseUrl()}/api/qr/getQRCodes`, { qrs });
};
