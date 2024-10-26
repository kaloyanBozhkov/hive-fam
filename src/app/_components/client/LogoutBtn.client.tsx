"use client";
import { signOut } from "@/server/actions/auth";
import { Button } from "../shadcn/Button.shadcn";

export const LogoutBtnClient = () => {
  return <Button onClick={() => signOut()}>Logout</Button>;
};
