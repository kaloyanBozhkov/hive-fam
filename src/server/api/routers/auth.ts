import { createTRPCRouter } from "@/server/api/trpc";
// import { createUser, userCreateSchema } from "@/server/queries/user/createUser";

export const authRouter = createTRPCRouter({
  // createAccount: adminProcedure
  //   .input(userCreateSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     return createUser(input);
  //   }),
});
