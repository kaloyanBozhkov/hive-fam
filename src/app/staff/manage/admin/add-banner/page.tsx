import { redirect } from "next/navigation";

export default function EditStaffPage() {
  redirect("/staff/manage/admin/banner-list");
  return null;
}
