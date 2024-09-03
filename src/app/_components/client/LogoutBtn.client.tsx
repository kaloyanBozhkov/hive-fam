"use client";
import { signOut } from "@/server/auth/server-actions";
import { Button } from "../shadcn/Button.shadcn";

export const LogoutBtnClient = () => {
  return <Button onClick={() => signOut()}>Logout</Button>;
};
