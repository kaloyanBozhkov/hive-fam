import { env } from "@/env";
import { Role } from "@prisma/client";
import { jwtVerify } from "jose";

export type JWTUser = {
  id: string;
  role: Role;
  email: string;
  name: string;
  isStaff: boolean;
  organization_id: string;
  organization_name: string;
};

export async function verifyAuth(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify<JWTUser>(
      token,
      new TextEncoder().encode(env.JWT_SECRET),
    );
    return payload.isStaff;
  } catch (error) {
    return false;
  }
}
