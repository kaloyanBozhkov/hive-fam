import Stack from "@/app/_components/layouts/Stack.layout";

import Events from "@/app/_components/organisms/Events.organism";
import LandingBanner from "@/app/_components/molecules/LandingBanner.molecule";

export default async function Home() {
  return (
   <>
      <div className="full-width mb-4 h-[420px] overflow-hidden border-y-[1px] border-white sm:h-[600px]">
        <LandingBanner />
      </div>
      <Stack className="min-h-[400px] gap-4">
        <Events />
      </Stack>
    </>
  );
}
