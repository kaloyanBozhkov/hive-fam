import { Role } from "@prisma/client";

export const JWT_COOKIE_NAME = "auth-token";

export const ERRORS = {
  UNAUTHORIZED: "unauthorized",
};
export const STAFF_ROLES: Role[] = [
  Role.ADMIN,
  Role.EVENT_MANAGER,
  Role.TICKET_SCANNER,
];
