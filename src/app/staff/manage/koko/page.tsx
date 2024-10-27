import Stack from "@/app/_components/layouts/Stack.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";

export default async function KokoPage() {
  return (
    <Stack className="gap-2">
      <p>Actions</p>
      <Stack className="w-full gap-4 sm:max-w-[300px]">
        <Button asChild>
          <Link href="/staff/manage/koko/org-list">Organization List</Link>
        </Button>
        <Button asChild>
          <Link href="/staff/manage/koko/admin-list">Admin List</Link>
        </Button>
      </Stack>
    </Stack>
  );
}
