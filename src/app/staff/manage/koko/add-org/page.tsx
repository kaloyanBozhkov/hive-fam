import Stack from "@/app/_components/layouts/Stack.layout";
import AddOrgForm from "@/app/_components/organisms/forms/AddOrg.form";
import { addOrg } from "@/server/actions/addOrg";

export default function AddOrg() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">
        New Organization
      </h1>
      <AddOrgForm onAdd={addOrg} />;
    </Stack>
  );
}
