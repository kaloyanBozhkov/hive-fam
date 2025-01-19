import Stack from "@/app/_components/layouts/Stack.layout";
import AddVenueForm from "@/app/_components/organisms/forms/AddVenue.form";
import { isManagerOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const errorMessages: Record<string, string> = {
  P2002: "A venue with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to create venue.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function addVenue(venueData: {
  name: string;
  description: string;
  maps_url: string;
  max_guests: number;
  city: string;
  street_addr: string;
  country: string;
}) {
  "use server";

  try {
    const user = await isManagerOrAbove();

    const venue = await db.venue.create({
      data: {
        ...venueData,
        organization_id: user.organization_id,
      },
    });

    // Revalidate the venue list page
    revalidatePath("/staff/manage");

    return { success: true, venue };
  } catch (error) {
    console.error("Failed to add venue:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

export default async function AddVenue() {
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">New Venue</h1>
      <AddVenueForm onAdd={addVenue} />
    </Stack>
  );
}
