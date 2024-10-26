import { redirect } from "next/navigation";

export default function EditStaffPage() {
  redirect("/staff/manage/admin/staff-list");
  return null;
}
