import { Role } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/server/db";

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(Role),
  name: z.string(),
  surname: z.string(),
  organization_id: z.string(),
  phone: z.string(),
  is_org_owner: z.boolean(),
});

export const createUser = async ({
  email,
  name,
  surname,
  role,
  password,
  phone,
  organization_id,
  is_org_owner,
}: z.infer<typeof userCreateSchema>) => {
  return db.staff.create({
    data: {
      email,
      name,
      surname,
      role,
      password: await encryptPassword(password),
      phone,
      organization: {
        connect: {
          id: organization_id,
        },
      },
      is_org_owner,
    },
  });
};

export const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const decryptPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
