import Stack from "@/app/_components/layouts/Stack.layout";
import { StaffNav } from "@/app/_components/organisms/StaffNav.organism";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { Role } from "@prisma/client";
import Link from "next/link";

export default function ManagePage() {
  return (
    <Stack className="gap-6">
      <h2 className="text-xl font-semibold">
        Welcome to the Events Management
      </h2>
      <p>Select an action from the buttons above or use the navigation menu.</p>
      <Stack className="w-full gap-4 sm:max-w-[300px]">
        <StaffNav userRole={Role.EVENT_MANAGER} variant="default" />
      </Stack>
    </Stack>
  );
}
