import Stack from "../_components/layouts/Stack.layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardFooter,
  CardHeader,
} from "../_components/shadcn/Card.shadcn";
import { getLinkTrees } from "@/server/actions/getLinkTrees";
import { getOrg } from "@/server/actions/org";
import { Button } from "../_components/shadcn/Button.shadcn";
import Link from "next/link";
import Group from "../_components/layouts/Group.layout";
import { FontAwesomeIconMap } from "@/server/other/linkIcons";
import { CopyUrlButton } from "../_components/client/CopyButtons.client";
import { redirect } from "next/navigation";
import RichTextReader from "../_components/molecules/lexical/RichTextReader";

// ISR: see REVALIDATE in @/server/config for reference values
export const revalidate = 60;

export default async function LinksPage() {
  const org = await getOrg();
  const orgLogoDataUrl = org.brand_logo_data_url;
  const linkTrees = await getLinkTrees(org.id);

  if (linkTrees.length === 0) {
    redirect("/");
  }

  return (
    <Stack className="mx-auto min-h-[400px] w-full max-w-[500px] gap-4 md:m-auto">
      <Card className="bg-white">
        <CardHeader className="block">
          <Stack className="items-center gap-4">
            {orgLogoDataUrl && (
              <img src={orgLogoDataUrl} alt="Logo" className="w-[150px]" />
            )}
            <h1 className="text-2xl font-bold">{org.display_name}</h1>
            {org.link_tree_description && (
              <Card className="notranslate bg-gray-50 p-5">
                <RichTextReader content={org.link_tree_description} />
              </Card>
            )}
          </Stack>
        </CardHeader>
        <CardFooter>
          <Stack className="w-full items-center gap-4">
            {linkTrees.length === 0 && <p>No links have been created yet</p>}
            {linkTrees.map((linkTree) => (
              <Button
                key={linkTree.id}
                asChild
                variant={linkTree.button_color.toLowerCase() as "default"}
                className="w-full shadow-md"
              >
                <Link href={`/links/${linkTree.id}`} target="_blank">
                  <Group className="items-center gap-[12px]">
                    <FontAwesomeIcon
                      icon={FontAwesomeIconMap[linkTree.button_icon]}
                    />
                    <span>{linkTree.name}</span>
                  </Group>
                </Link>
              </Button>
            ))}
          </Stack>
        </CardFooter>
      </Card>
      <CopyUrlButton variant="secondary" />
      <Button variant="outline">
        <Link href="/">Back To Home</Link>
      </Button>
    </Stack>
  );
}
