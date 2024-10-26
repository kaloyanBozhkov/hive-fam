"use client";

import { useToast } from "@/app/hooks/shadcn/useToast.shadcn";
import { useConsumeSearchparam } from "@/app/hooks/useConsumeSearchParam";
import { ERRORS } from "@/server/auth/constants";
import { useEffect } from "react";

export const URLToasts = () => {
  const error = useConsumeSearchparam("error");
  const { toast } = useToast();

  useEffect(() => {
    if (!error) return;
    if (error === ERRORS.UNAUTHORIZED) {
      toast({
        title: "Could not login",
        description: "Check your credentials and try again.",
      });
    }
  }, [error, toast]);

  return null;
};
