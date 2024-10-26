import { Role } from "@prisma/client";
import { z } from "zod";
import { db } from "@/server/db";

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.nativeEnum(Role),
  name: z.string(),
  surname: z.string(),
  organization_id: z.string().optional(),
  phone: z.string(),
});

export const updateUser = async ({
  id,
  email,
  name,
  surname,
  role,
  password,
  phone,
  organization_id,
}: z.infer<typeof userUpdateSchema>) => {
  return db.staff.update({
    where: { id },
    data: {
      email,
      name,
      surname,
      role,
      password,
      phone,
      organization: organization_id
        ? {
            connect: {
              id: organization_id,
            },
          }
        : undefined,
    },
  });
};
