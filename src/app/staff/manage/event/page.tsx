import Stack from "@/app/_components/layouts/Stack.layout";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";

export default function ManagePage() {
  return (
    <Stack className="gap-6">
      <h2 className="text-xl font-semibold">
        Welcome to the Events Management
      </h2>
      <p>Select an action from the buttons above or use the navigation menu.</p>
      <Stack className="max-w-[300px] gap-4">
        <Button asChild>
          <Link href="/staff/manage/event/event-list">Events List</Link>
        </Button>
        <Button asChild>
          <Link href="/staff/manage/event/venue-list">Venues List</Link>
        </Button>
      </Stack>
    </Stack>
  );
}
