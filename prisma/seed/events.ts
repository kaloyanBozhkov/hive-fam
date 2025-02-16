import { DOMAIN_CONFIG } from "@/server/config";
import { createUUID } from "@/utils/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedVenues() {
  const orgId = DOMAIN_CONFIG.localhost;
  const venueId = createUUID();

  await prisma.venue.createMany({
    data: [
      {
        id: venueId,
        organization_id: orgId,
        name: "Venue 1",
        description: "Description for Venue 1",
        maps_url: "https://maps.example.com/venue1",
        max_guests: 200,
        city: "City 1",
        street_addr: "123 Street 1",
        country: "Country 1",
      },
      {
        organization_id: orgId,
        name: "Venue 2",
        description: "Description for Venue 2",
        maps_url: "https://maps.example.com/venue2",
        max_guests: 300,
        city: "City 2",
        street_addr: "456 Street 2",
        country: "Country 2",
      },
    ],
  });
  return venueId;
}

async function main() {
  // Seed venues first
  const venueId = await seedVenues();

  // Create the events
  await prisma.event.createMany({
    data: [
      {
        title: "Past Event 1",
        description: "This is a description for past event 1.",
        date: new Date("2023-01-01T00:00:00Z"), // Example past date
        venue_id: venueId,
      },
      {
        title: "Past Event 2",
        description: "This is a description for past event 2.",
        date: new Date("2023-02-01T00:00:00Z"), // Example past date
        venue_id: venueId, // Repla ce with actual venue ID
      },
      {
        title: "Future Event 1",
        description: "This is a description for future event 1.",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        venue_id: venueId, // Replace with actual venue ID
      },
      {
        title: "Future Event 2",
        description: "This is a description for future event 2.",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        venue_id: venueId, // Replace with actual venue ID
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
