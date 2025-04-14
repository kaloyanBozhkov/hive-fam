"use server";

import { cookies } from "next/headers";
import { ERRORS, JWT_COOKIE_NAME } from "@/server/auth/constants";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { env } from "@/env";
import { getUserByEmailAndPassword } from "../queries/user/getUser";
import type { JWTUser } from "@/server/auth/verifyAuth";

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await getUserByEmailAndPassword(email, password);
  if (!user?.isStaff)
    return redirect(`/staff/login?error=${ERRORS.UNAUTHORIZED}`);

  // Create a JWT token
  const token = await new SignJWT({
    email,
    role: user.role,
    name: user.name,
    id: user.id,
    isStaff: user.isStaff,
    organization_id: user.organization_id,
    organization_name: user.organization.name,
  } as JWTUser)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(env.JWT_SECRET));

  // Set the token in a cookie
  (await cookies()).set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  redirect("/staff/manage");
};

export const signOut = async () => {
  (await cookies()).delete(JWT_COOKIE_NAME);
  redirect("/staff/login");
};
