"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/shadcn/Drawer.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import Stack from "../layouts/Stack.layout";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faLink } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faTwitter,
  faYoutube,
  faSoundcloud,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import Group from "../layouts/Group.layout";
import { LinkType, type Role } from "@prisma/client";
import { StaffNav } from "./StaffNav.organism";
import { usePathname } from "next/navigation";

const DrawerMenu = ({
  extraChild,
  userRole,
  socialLinks,
}: {
  extraChild?: ReactNode;
  socialLinks: { type: LinkType; url: string; name: string }[];
  userRole?: Role;
}) => {
  const [s, toggleS] = useState(false);
  const pathname = usePathname();
  const isOnStaffPage = !!pathname?.startsWith("/staff/manage");
  const staffMode = userRole && isOnStaffPage;
  useEffect(() => {
    toggleS(false);
  }, [pathname]);

  return (
    <Drawer onClose={() => toggleS(false)}>
      <DrawerTrigger className="text-white" onClick={() => toggleS((p) => !p)}>
        <FontAwesomeIcon icon={s ? faClose : faBars} className="text-[24px]" />
      </DrawerTrigger>
      <DrawerContent className="m-auto lg:max-w-[900px]">
        <DrawerHeader>
          {staffMode ? (
            <Stack className="gap-4">
              <DrawerTitle>- Backoffice -</DrawerTitle>
              <StaffNav userRole={userRole} variant="secondary" />
              {!pathname?.endsWith("staff/manage") && (
                <Link href="/staff/manage" className="-mb-5">
                  <Button variant="secondary" className="w-full">
                    Management
                  </Button>
                </Link>
              )}
            </Stack>
          ) : (
            <Stack className="gap-4">
              <DrawerTitle>
                <p className="text-left font-rex-bold">
                  Interested in more? You can check us out on:
                </p>
              </DrawerTitle>
              <DrawerDescription asChild>
                <Stack className="w-full items-start justify-between gap-1">
                  {socialLinks.map(({ url, type, name }, idx) => (
                    <Button variant="link" asChild key={idx}>
                      <Link href={url}>
                        <Group className="jusitfy-center items-center gap-3">
                          <FontAwesomeIcon
                            icon={LINK_TYPE_ICON[type]}
                            className="text-[22px]"
                          />
                          <h2 className="font-rex-bold text-[24px] leading-[24px] text-green-800">
                            {name}
                          </h2>
                        </Group>
                      </Link>
                    </Button>
                  ))}
                  {extraChild}
                </Stack>
              </DrawerDescription>
            </Stack>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="default">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;

const LINK_TYPE_ICON = {
  [LinkType.INSTAGRAM]: faInstagram,
  [LinkType.FACEBOOK]: faFacebook,
  [LinkType.TWITTER]: faTwitter,
  [LinkType.YOUTUBE]: faYoutube,
  [LinkType.SOUNDCLOUD]: faSoundcloud,
  [LinkType.TIKTOK]: faTiktok,
  [LinkType.OTHER]: faLink,
} as const;
