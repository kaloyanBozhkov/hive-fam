import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./constants";
import { env } from "@/env";

export const isAuthed = () => {
  const authed = cookies().get(AUTH_COOKIE_NAME);
  if (!authed) return false;
  return true;
};

export const isStaff = (username: string, pass: string) => {
  const users = env.STAFF;

  return users.some((creds) => {
    const [u, p] = creds;
    return u === username && p === pass;
  });
};
