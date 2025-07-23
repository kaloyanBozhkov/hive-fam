import AddCustomQRForm from "@/app/_components/organisms/forms/AddCustomQR.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { createCustomQR } from "@/server/actions/qr/createCustomQR";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A custom QR with this description already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create custom QR.",
  default: "An unexpected error occurred. Please try again.",
};

async function addCustomQR(qrData: {
  description: string;
  forward_to_url: string;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();
    const customQR = await createCustomQR(
      qrData.description,
      qrData.forward_to_url,
      user.organization_id,
    );

    revalidatePath("/staff/manage/admin/custom-qr-list");

    return { success: true, customQR };
  } catch (error) {
    console.error("Failed to add custom QR:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function AddCustomQR() {
  return <AddCustomQRForm onAdd={addCustomQR} />;
} 