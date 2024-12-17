import { redirect } from "next/navigation";

export default function EditStaffPage() {
  redirect("/staff/manage/admin/link-list");
  return null;
}
