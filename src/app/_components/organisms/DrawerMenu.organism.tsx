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
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import Group from "../layouts/Group.layout";

const DrawerMenu = () => {
  const [s, toggleS] = useState(false);

  return (
    <Drawer onClose={() => toggleS(false)}>
      <DrawerTrigger className="text-white" onClick={() => toggleS((p) => !p)}>
        <FontAwesomeIcon icon={s ? faClose : faBars} className="text-[24px]" />
      </DrawerTrigger>
      <DrawerContent className="m-auto lg:max-w-[900px]">
        <DrawerHeader>
          <Stack className="gap-4">
            <DrawerTitle>
              <p className="text-left font-rex-bold">
                Interested in more? You can check us out on:
              </p>
            </DrawerTitle>
            <DrawerDescription asChild>
              <Stack className="w-full items-start justify-between gap-1">
                <Button variant="link">
                  <Link href="https://www.instagram.com/hive.home.bg/">
                    <Group className="jusitfy-center items-center gap-3">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="text-[22px]"
                      />
                      <h2 className="font-rex-bold text-[24px] leading-[24px] text-green-800">
                        Instagram
                      </h2>
                    </Group>
                  </Link>
                </Button>
              </Stack>
            </DrawerDescription>
          </Stack>
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
