import Stack from "@/app/_components/layouts/Stack.layout";
import AddOrgForm from "@/app/_components/organisms/forms/AddOrg.form";
import { isKoko } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { type Currency, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "This org name is already in use.",
  P2003: "Invalid input data.",
  P2025: "Unable to create org.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function addOrg(orgData: { name: string; default_currency: Currency }) {
  "use server";

  try {
    await isKoko();

    await db.organization.create({
      data: orgData,
    });

    revalidatePath("/staff/manage/koko/org-list");

    return { success: true };
  } catch (error) {
    console.error("Failed to add org:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default function AddOrg() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">
        New Organization
      </h1>
      <AddOrgForm onAdd={addOrg} />;
    </Stack>
  );
}
