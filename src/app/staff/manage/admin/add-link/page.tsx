import AddLinkForm from "@/app/_components/organisms/forms/AddLink.form";
import { addLink } from "@/server/actions/addLink";

export default async function AddLink() {
  return <AddLinkForm onAdd={addLink} />;
}
