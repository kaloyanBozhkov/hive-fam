import { env } from "@/env";
import { jwtVerify } from "jose";
import type { JWTUser } from "./verifyAuth";
import { cookies } from "next/headers";
import { JWT_COOKIE_NAME } from "./constants";
import { redirect } from "next/navigation";

export const getJWTUser = async () => {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value;
  if (!token) redirect("/staff/login");
  const { payload } = await jwtVerify<JWTUser>(
    token,
    new TextEncoder().encode(env.JWT_SECRET),
  );
  return payload;
};

export const getUserRole = async () => {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value;
  if (!token) return null;
  const { payload } = await jwtVerify<JWTUser>(
    token,
    new TextEncoder().encode(env.JWT_SECRET),
  );
  return payload.role;
};
