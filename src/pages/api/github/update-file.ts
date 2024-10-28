// import { env } from "@/env";
// import commitAndPushToMaster from "@/server/github/commitAndPushToMaster";
// import { type NextApiRequest, type NextApiResponse } from "next";

// type Payload = {
//   secret: string;
//   filePath: string;
//   contents: string;
//   commitMessage?: string;
// };

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "10mb",
//     },
//     maxDuration: 10,
//   },
// };

// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const oops = () => res.status(405).send({ message: "Something went wrong" });

//   if (req.method !== "POST") return oops();

//   const { secret, filePath, contents, commitMessage } = req.body as Payload;

//   if (secret !== env.SENSITIVE_CRUD_SECRET || !filePath || !contents)
//     return oops();

//   try {
//     const { success } = await commitAndPushToMaster(
//       filePath,
//       contents,
//       commitMessage,
//     );
//     if (!success)
//       throw Error("github/uplaod-file commitAndPushToMaster failed");
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// }

// export default handler;

export default {};
