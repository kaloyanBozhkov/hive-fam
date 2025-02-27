import "@/styles/globals.css";

import { getOrg, isMothershipOrg } from "@/server/actions/org";
import CarrierLayout from "./_components/layouts/Carrier.layout";
import MothershipLayout from "./_components/layouts/Mothership.layout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await getOrg();
  const isMothership = await isMothershipOrg(org.id);

  if (isMothership) {
    return <MothershipLayout org={org}>{children}</MothershipLayout>;
  }

  return <CarrierLayout org={org}>{children}</CarrierLayout>;
}
