import Stack from "@/app/_components/layouts/Stack.layout";
import Header from "@/app/_components/organisms/Header.organism";

export default async function Order({}) {
  return (
    <div className="grid-page min-h-screen w-full pb-4">
      <Header />
      <Stack className="min-h-[400px] gap-4">
        <p>page</p>
      </Stack>
    </div>
  );
}
