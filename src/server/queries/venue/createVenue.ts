import { db } from "@/server/db";

export const createVenue = async ({
  name,
  description,
  maps_url,
  max_guests,
  city,
  street_addr,
  country,
  organization_id,
}: {
  name: string;
  description: string;
  maps_url: string;
  max_guests: number;
  organization_id: string;
  city: string;
  street_addr: string;
  country: string;
}) => {
  return db.venue.create({
    data: {
      name,
      description,
      maps_url,
      max_guests,
      city,
      street_addr,
      country,
      organization: {
        connect: {
          id: organization_id,
        },
      },
    },
  });
};
