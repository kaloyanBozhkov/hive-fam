import Stack from "@/app/_components/layouts/Stack.layout";
import { StaffNav } from "@/app/_components/organisms/StaffNav.organism";
import { Role } from "@prisma/client";

export default async function KokoPage() {
  return (
    <Stack className="gap-2">
      <p>Actions</p>
      <Stack className="w-full gap-4 sm:max-w-[300px]">
        <StaffNav userRole={Role.KOKO} variant="default" />
      </Stack>
    </Stack>
  );
}
