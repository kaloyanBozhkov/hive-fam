import Stack from "@/app/_components/layouts/Stack.layout";
import { VenueList } from "./table";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "@/app/_components/layouts/Group.layout";
import { getVenuesData } from "@/server/actions/getVenues";

export default async function VenueListPage() {
  const data = await getVenuesData();
  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Venue List</h2>
        <Button asChild>
          <Link href="/staff/manage/event/add-venue">Add Venue</Link>
        </Button>
      </Group>
      <VenueList data={data} />
    </Stack>
  );
}
