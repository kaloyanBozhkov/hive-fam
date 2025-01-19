import Stack from "@/app/_components/layouts/Stack.layout";
import { db } from "@/server/db";
import EditVenueForm from "@/app/_components/organisms/forms/EditVenue.form";
import { isManagerOrAbove } from "@/server/auth/roleGates";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const errorMessages: Record<string, string> = {
  P2002: "A venue with this name already exists.",
  P2003: "Invalid input data.",
  P2025: "Unable to update venue.",
  // Add more error codes as needed
  default: "An unexpected error occurred. Please try again.",
};

async function editVenue(venueData: {
  id: string;
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

    const venue = await db.venue.update({
      where: { id: venueData.id, organization_id: user.organization_id },
      data: {
        name: venueData.name,
        description: venueData.description,
        maps_url: venueData.maps_url,
        max_guests: venueData.max_guests,
        city: venueData.city,
        street_addr: venueData.street_addr,
        country: venueData.country,
      },
    });

    // Revalidate the venue list page
    revalidatePath("/staff/manage/event/venue-list");

    return { success: true, venue };
  } catch (error) {
    console.error("Failed to edit venue:", error);

    let errorMessage = errorMessages.default;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = errorMessages[error.code] ?? errorMessages.default;
    }

    return { success: false, error: errorMessage };
  }
}

const getInitialData = async (id: string) => {
  const user = await isManagerOrAbove();

  const venue = await db.venue.findUniqueOrThrow({
    where: {
      id,
      organization_id: user.organization_id,
    },
  });
  return venue;
};

export default async function EditVenuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Stack className="gap-y-8">
      <h1 className="text-[22px] font-semibold leading-[120%]">Edit Admin</h1>
      <EditVenueForm
        onEdit={editVenue}
        initialData={await getInitialData(id)}
      />
    </Stack>
  );
}
