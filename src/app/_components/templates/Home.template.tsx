import { type ReactNode } from "react";
import Stack from "@/app/_components/layouts/Stack.layout";

const HomeTemplate = ({
  albums,
  main,
}: {
  albums: ReactNode;
  main: ReactNode;
}) => {
  return (
    <Stack className="h-screen w-screen gap-4">
      <section className="h-[400px] sm:h-[600px]">{albums}</section>
      <main>{main}</main>
    </Stack>
  );
};

export default HomeTemplate;
