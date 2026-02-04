import { env } from "@/env";
import { isAdminOrAbove, isRoleManagerOrAbove } from "@/server/auth/roleGates";
import { getDomainFromOrgId } from "@/server/config";
import { db } from "@/server/db";
import { stripeCli } from "@/server/stripe/stripe";

export async function getPayoutsAccountLink() {
  const user = await isAdminOrAbove();
  const isDev = env.NODE_ENV === "development";
  const domain = isDev
    ? "localhost:3000"
    : getDomainFromOrgId(user.organization_id);
  const protocol = isDev ? "http" : "https";

  const { stripe_account_id: account } = await db.staff.findFirstOrThrow({
    where: {
      id: user.id,
    },
    select: {
      stripe_account_id: true,
    },
  });

  let account_id = account;

  if (!account_id) {
    const account = await refreshPayoutsAccountLink();
    account_id = account.id;
  }

  const accountLink = await stripeCli.accountLinks.create({
    account: account_id,
    return_url: `${protocol}://${domain}/staff/manage/admin/profits?confirmed=${account_id}`,
    refresh_url: `${protocol}://${domain}/staff/manage/admin/profits?refresh=true`,
    type: "account_onboarding",
  });

  return accountLink;
}

export async function refreshPayoutsAccountLink() {
  const user = await isAdminOrAbove();
  const account = await stripeCli.accounts.create({
    email: user.email,
    type: "express",
  });
  await db.staff.update({
    where: {
      id: user.id,
    },
    data: {
      stripe_account_id: account.id,
      stripe_account_setup: false,
    },
  });
  return account;
}

export async function confirmPayoutsAccountLink(account_id: string) {
  const user = await db.staff.findUnique({
    where: {
      stripe_account_id: account_id,
    },
  });

  if (!user) throw new Error("User not found");

  isRoleManagerOrAbove(user.role);

  await db.staff.update({
    where: { id: user.id, stripe_account_id: account_id },
    data: { stripe_account_setup: true },
  });
}

export async function syncPayoutsAccountStatus(account_id: string) {
  const account = await stripeCli.accounts.retrieve(account_id);

  if (account.charges_enabled && account.details_submitted) {
    await confirmPayoutsAccountLink(account_id);
  }
}
