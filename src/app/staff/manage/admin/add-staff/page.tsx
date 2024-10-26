import AddStaffForm from "@/app/_components/organisms/forms/AddStaff.form";
import { addStaff } from "@/server/actions/addStaff";

export default async function AddStaff() {
  return <AddStaffForm onAdd={addStaff} />;
}
