import { STAFF_ROLES } from "@/server/auth/constants";
import { db } from "@/server/db";
import { Role } from "@prisma/client";
import { decryptPassword } from "./createUser";

export const getUserByEmailAndPassword = async (
  email: string,
  pass: string,
) => {
  const user = await db.staff.findUnique({
    where: { email },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) return null;
  const isPasswordCorrect = await decryptPassword(pass, user.password);
  if (!isPasswordCorrect) return null;

  return {
    ...user,
    isStaff: STAFF_ROLES.includes(user.role) || user.role === Role.KOKO,
  };
};
