import { env } from "@/env";
import { jwtVerify } from "jose";
import type { JWTUser } from "./verifyAuth";
import { cookies } from "next/headers";
import { JWT_COOKIE_NAME } from "./constants";
import { redirect } from "next/navigation";

export const getJWTUser = async (notAuthedRedirectTo = "/staff/login") => {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value;
  if (!token) {
    redirect(notAuthedRedirectTo);
  }
  const { payload } = await jwtVerify<JWTUser>(
    token,
    new TextEncoder().encode(env.JWT_SECRET),
  );
  return payload;
};
