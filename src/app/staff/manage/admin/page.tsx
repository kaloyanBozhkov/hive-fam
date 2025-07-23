import Stack from "@/app/_components/layouts/Stack.layout";
import { StaffNav } from "@/app/_components/organisms/StaffNav.organism";

export default function AdminPage() {
  return (
    <Stack className="gap-6">
      <h2 className="text-xl font-semibold">Welcome to the Admin Dashboard</h2>
      <p>Select an action from the buttons above or use the navigation menu.</p>
      <Stack className="w-full gap-4 sm:max-w-[300px]">
        <StaffNav userRole="ADMIN" variant="default" />
      </Stack>
    </Stack>
  );
}
