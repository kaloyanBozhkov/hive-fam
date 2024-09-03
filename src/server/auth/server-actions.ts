"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, ERRORS } from "./constants";
import { redirect } from "next/navigation";
import { isStaff } from "./isStaff";

export const signIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  if (isStaff(username, password)) {
    cookies().set(AUTH_COOKIE_NAME, username, {
      maxAge: 60 * 60 * 12, // 12hrs
    });
    redirect("/staff/manage");
  }
  redirect(`/staff/login?error=${ERRORS.UNAUTHORIZED}`);
};

export const signOut = async () => {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect("/staff/login");
};
