"use client";

import { usePathname } from "next/navigation";
import { Button } from "../../shadcn/Button.shadcn";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const GoBack = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {pathname !== "/staff/manage/event" ? (
        <Button
          onClick={() =>
            pathname
              ? router.push(pathname.split("/").slice(0, -1).join("/"))
              : router.back()
          }
        >
          Go back
        </Button>
      ) : (
        <Button asChild>
          <Link href="/staff/manage">Back to management</Link>
        </Button>
      )}
    </>
  );
};
