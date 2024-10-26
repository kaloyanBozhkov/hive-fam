import { redirect } from "next/navigation";

export default function EditAdminPage() {
  redirect("/staff/manage/koko/admin-list");
  return null;
}
