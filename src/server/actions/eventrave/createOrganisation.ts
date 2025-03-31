"use server";

export const createOrganisation = async (organisationName: string) => {
  try {
    const organisation = await prisma.organisation.create({
      data: {
        name: organisationName,
      },
    });
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create organisation" };
  }
};
