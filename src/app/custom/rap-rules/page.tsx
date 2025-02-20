import Link from "next/link";
import Stack from "../../_components/layouts/Stack.layout";
import { Button } from "../../_components/shadcn/Button.shadcn";
import { RapBattleRulesList } from "../../_components/organisms/forms/specific/RapBattleParticipantSignUp";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/_components/shadcn/Card.shadcn";

const RapRules = () => {
  return (
    <Stack className="mx-auto min-h-[400px] w-full gap-4">
      <Card>
        <CardHeader>About the Rap Battle showdown</CardHeader>
        <CardContent>
          <Stack className="gap-4">
            <RapBattleRulesList />
            <p>
              When you sign up you can also provide a link to the songs you want
              us to play for each round.
            </p>
            <p>
              The crowd will vote who to disqualify each round. After each round
              2 people will be disqualified.
              <br />
              How does the crowd vote? Noise, noise, noise!
            </p>
            <p>The winner takes 500 BGN.</p>
            <p className="mt-4">
              In case you are still wondering, yes this rap battle is separate
              from the freestyle battle. Both will have a 500 BGN reward and
              both will be in the same night.
              <br />
              You can only sign up for one of the battles, unless you are super
              good.
              <br />
              Bulgarian and English are the only languages allowed.. unless you
              bring a huge crowd with you.
            </p>
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack className="w-full justify-end gap-2">
            <Button variant="default">
              <Link href="/">Sign Up!</Link>
            </Button>
            <Button variant="outline">
              <Link href="/">Back To Home</Link>
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </Stack>
  );
};

export default RapRules;
