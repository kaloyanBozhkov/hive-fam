import Stack from "@/app/_components/layouts/Stack.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";

export default function AdminPage() {
  return (
    <Stack className="gap-6">
      <h2 className="text-xl font-semibold">Welcome to the Admin Dashboard</h2>
      <p>Select an action from the buttons above or use the navigation menu.</p>
      <Stack className="max-w-[300px] gap-4">
        <Button asChild>
          <Link href="/staff/manage/admin/staff-list">Staff List</Link>
        </Button>
        <Button asChild>
          <Link href="/staff/manage/admin/org-edit">Organization Details</Link>
        </Button>
      </Stack>
    </Stack>
  );
}
