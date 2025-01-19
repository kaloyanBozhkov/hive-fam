import { Role } from "@prisma/client";

import { getJWTUser } from "./getJWTUser";

export const isManagerOrAbove = async () => {
  const user = await getJWTUser();
  if (
    !([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(user.role)
  )
    throw new Error("Unauthorized");

  return user;
};

export const isAdminOrAbove = async () => {
  const user = await getJWTUser();
  if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(user.role))
    throw new Error("Unauthorized");

  return user;
};

export const isKoko = async () => {
  const user = await getJWTUser();
  if (user.role !== Role.KOKO) throw new Error("Unauthorized");
  return user;
};
