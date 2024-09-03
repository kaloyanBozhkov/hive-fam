"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useConsumeSearchparam = (param: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams?.get(param)) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete(param);
    router.replace(`${pathname}?${currentParams.toString()}`);
  }, [searchParams, pathname, router, param]);

  return searchParams?.get(param);
};
