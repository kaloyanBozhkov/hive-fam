import { db } from "@/server/db";

export const createVenue = async ({
  name,
  description,
  maps_url,
  max_guests,
  organization_id,
}: {
  name: string;
  description: string;
  maps_url: string;
  max_guests: number;
  organization_id: string;
}) => {
  return db.venue.create({
    data: {
      name,
      description,
      maps_url,
      max_guests,
      organization: {
        connect: {
          id: organization_id,
        },
      },
    },
  });
};
