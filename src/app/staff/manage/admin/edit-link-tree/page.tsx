import { redirect } from "next/navigation";

export default function EditStaffPage() {
  redirect("/staff/manage/admin/link-tree-list");
  return null;
}
