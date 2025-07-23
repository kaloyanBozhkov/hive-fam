import Stack from "@/app/_components/layouts/Stack.layout";
import { CustomQRList } from "./table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { getAllCustomQRs } from "@/server/actions/qr/getAllCustomQRs";

const getCustomQRs = async () => {
  const user = await isAdminOrAbove();
  const customQRs = await getAllCustomQRs(user.organization_id);
  return customQRs;
};

export default async function CustomQRListPage() {
  const data = await getCustomQRs();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Custom QR Codes</h2>
        <Button asChild>
          <Link href="/staff/manage/admin/add-custom-qr">Add Custom QR</Link>
        </Button>
      </Group>
      <CustomQRList data={data} />
    </Stack>
  );
} 