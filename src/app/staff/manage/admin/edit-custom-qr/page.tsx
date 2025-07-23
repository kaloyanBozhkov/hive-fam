import { redirect } from "next/navigation";

export default function EditCustomQRPage() {
  redirect("/staff/manage/admin/custom-qr-list");
  return null;
} 