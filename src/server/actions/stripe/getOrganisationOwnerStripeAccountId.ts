import { db } from "@/server/db";

export async function getOrganisationOwnerStripeAccountId(
  organizationId: string,
) {
  const organization = await db.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) throw new Error("Organization not found");

  const owner = await db.staff.findFirstOrThrow({
    where: {
      organization_id: organizationId,
      is_org_owner: true,
    },
  });

  if (!owner) throw new Error("Organization owner not found");
  if (!owner.stripe_account_id || !owner.stripe_account_setup)
    throw new Error(
      "Organization owner has no stripe account ID or is not setup fully",
    );

  return owner.stripe_account_id;
}

export async function getTransferDataForPaymentIntentCheckoutSession(
  organizationId: string,
  eventRaveFee?: number,
) {
  try {
    const accountId = await getOrganisationOwnerStripeAccountId(organizationId);

    return {
      payment_intent_data: {
        ...(eventRaveFee ? { application_fee_amount: eventRaveFee } : {}),
        on_behalf_of: accountId,
        transfer_data: {
          destination: accountId,
        },
      },
    };
  } catch (error) {
    return {};
  }
}
