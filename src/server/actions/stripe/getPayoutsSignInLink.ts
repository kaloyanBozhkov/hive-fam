import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { stripeCli } from "@/server/stripe/stripe";

export async function getPayoutsSignInLink(account_id?: string | null) {
  const user = await isAdminOrAbove();

  let account: string | null | undefined = account_id;

  if (!account) {
    const { stripe_account_id } = await db.staff.findFirstOrThrow({
      where: {
        id: user.id,
      },
      select: {
        stripe_account_id: true,
      },
    });

    account = stripe_account_id;
  }

  if (!account)
    throw Error("Expected to have already setup a stripe linked account.");

  const loginLink = await stripeCli.accounts.createLoginLink(account);
  return loginLink.url;
}
