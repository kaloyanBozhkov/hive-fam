import { DOMAIN_CONFIG } from "@/server/config";
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create the organization
  const organization = await prisma.organization.create({
    data: {
      id: DOMAIN_CONFIG.localhost,
      name: "Koko's Org",
    },
  });

  // Create the KOKO staff member
  const hashedPassword = await hash("123", 10);
  await prisma.staff.create({
    data: {
      email: "kaloyan@bozhkov.com",
      name: "Koko",
      surname: "D.",
      password: hashedPassword,
      role: Role.KOKO,
      phone: "+359 876543338",
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
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
