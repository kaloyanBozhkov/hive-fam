import Stack from "@/app/_components/layouts/Stack.layout";
import AddVenueForm from "@/app/_components/organisms/forms/AddVenue.form";
import { addVenue } from "@/server/actions/addVenue";

export default async function AddVenue() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Venue</h1>
      <AddVenueForm onAdd={addVenue} />
    </Stack>
  );
}
