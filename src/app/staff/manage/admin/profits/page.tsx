import Stack from "@/app/_components/layouts/Stack.layout";
import { ProfitsList } from "./table";
import { db } from "@/server/db";
import Group from "@/app/_components/layouts/Group.layout";
import { isAdminOrAbove } from "@/server/auth/roleGates";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import {
  getPayoutsAccountLink,
  refreshPayoutsAccountLink,
  syncPayoutsAccountStatus,
} from "@/server/actions/stripe/getPayoutsAccountLink";
import { getPayoutsSignInLink } from "@/server/actions/stripe/getPayoutsSignInLink";
import { redirect } from "next/navigation";
import { Separator } from "@/app/_components/shadcn/Separator.shadcn";
import getInvoices from "@/server/queries/invoice/getInvoices";

const getEvents = async () => {
  const user = await isAdminOrAbove();

  const events = await db.event.findMany({
    where: {
      organization_id: user.organization_id,
    },
    select: {
      id: true,
      title: true,
      sold_tickets: {
        select: {
          price: true,
          currency: true,
          scanned: true,
          is_free: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return events;
};

const getStripeAccountInfo = async () => {
  const user = await isAdminOrAbove();

  const account = await db.staff.findFirstOrThrow({
    where: { id: user.id },
    select: {
      stripe_account_id: true,
      stripe_account_setup: true,
      is_org_owner: true,
    },
  });

  return account;
};

export default async function ProfitsPage({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string; confirmed?: string }>;
}) {
  const { refresh, confirmed } = await searchParams;
  if (refresh === "true") {
    await refreshPayoutsAccountLink();
    redirect("/staff/manage/admin/profits");
  }
  if (confirmed) {
    await syncPayoutsAccountStatus(confirmed);
    redirect("/staff/manage/admin/profits");
  }

  const data = await getEvents();
  const stripeAccountInfo = await getStripeAccountInfo();

  return (
    <Stack className="gap-4">
      <Group className="align-between w-full justify-between">
        <h2 className="text-xl font-semibold">Your Earnings</h2>
      </Group>
      <ProfitsList events={data} />
      {stripeAccountInfo.is_org_owner ? (
        <>
          <Separator className="my-4" />
          <Stack className="items-start gap-4">
            <h2 className="text-xl font-semibold">Payouts</h2>
            <p>
              You are the organisation owner. You can handle payouts for your
              organisation.
            </p>
            <Button
              variant="default"
              onClick={async () => {
                "use server";

                if (!stripeAccountInfo.stripe_account_setup) {
                  const link = await getPayoutsAccountLink();
                  redirect(link.url);
                } else {
                  const link = await getPayoutsSignInLink(
                    stripeAccountInfo.stripe_account_id,
                  );
                  redirect(link);
                }
              }}
            >
              {stripeAccountInfo.stripe_account_setup
                ? "Go To Stripe Payouts"
                : "Setup Stripe Payouts"}
            </Button>
          </Stack>
        </>
      ) : (
        <p>Note: Your organisation owner is in charge of handling payouts.</p>
      )}
    </Stack>
  );
}
