import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import EditCustomQRForm from "@/app/_components/organisms/forms/EditCustomQR.form";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { updateCustomQR } from "@/server/actions/qr/updateCustomQR";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A custom QR with this description already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update custom QR.",
  default: "An unexpected error occurred. Please try again.",
};

async function editCustomQR(qrData: {
  id: string;
  description: string;
  forward_to_url: string;
}) {
  "use server";

  try {
    const user = await isAdminOrAbove();

    const customQR = await updateCustomQR(
      qrData.id,
      qrData.description,
      qrData.forward_to_url,
      user.organization_id,
    );

    revalidatePath("/staff/manage/admin/custom-qr-list");

    return { success: true, customQR };
  } catch (error) {
    console.error("Failed to edit custom QR:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getInitialData = async (id: string) => {
  const user = await isAdminOrAbove();

  const customQR = await db.custom_qr_code.findUniqueOrThrow({
    where: {
      organization_id: user.organization_id,
      id,
    },
  });

  return customQR;
};

export default async function EditCustomQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Custom QR</h1>
      <EditCustomQRForm
        onEdit={editCustomQR}
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
} 