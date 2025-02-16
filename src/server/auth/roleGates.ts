import { Role } from "@prisma/client";

import { getJWTUser } from "./getJWTUser";

export const isManagerOrAbove = async () => {
  const user = await getJWTUser();
  isRoleManagerOrAbove(user.role);
  return user;
};

export const isAdminOrAbove = async () => {
  const user = await getJWTUser();
  isRoleAdminOrAbove(user.role);
  return user;
};

export const isKoko = async () => {
  const user = await getJWTUser();
  isRoleKoko(user.role);
  return user;
};

export const isRoleAdminOrAbove = (role: Role) => {
  if (!([Role.KOKO, Role.ADMIN] as Role[]).includes(role))
    throw new Error("Unauthorized");
};

export const isRoleManagerOrAbove = (role: Role) => {
  if (!([Role.KOKO, Role.ADMIN, Role.EVENT_MANAGER] as Role[]).includes(role))
    throw new Error("Unauthorized");
};

export const isRoleKoko = (role: Role) => {
  if (role !== Role.KOKO) throw new Error("Unauthorized");
};
