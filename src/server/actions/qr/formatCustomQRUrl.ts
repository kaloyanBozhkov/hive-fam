import { getDomainFromOrgId } from "@/server/config";

export const formatCustomQRUrl = (id: string, organization_id: string) => {
  return `${getDomainFromOrgId(organization_id)}/api/qr/custom/${id}`;
};
