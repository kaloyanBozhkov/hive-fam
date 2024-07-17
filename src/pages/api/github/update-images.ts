import { env } from "@/env";
import commitImagesToRepo from "@/server/github/update-image";
import { getFilesFromUrls } from "@/server/utils.server";
import { type NextApiRequest, type NextApiResponse } from "next";

type ImgUrl = string;
type FileName = string;

type Payload = {
  secret: string;
  imgUrls: Record<FileName, ImgUrl>;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    maxDuration: 10,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const oops = () => res.status(405).send({ message: "Something went wrong" });

  if (req.method !== "POST") return oops();

  const { secret, imgUrls } = req.body as Payload;

  if (secret !== env.SENSITIVE_CRUD_SECRET) return oops();

  try {
    const base64s = await getFilesFromUrls(imgUrls);

    if (!base64s) throw Error("Failed to get base64s from imgUrls");

    const { success } = await commitImagesToRepo(base64s);

    if (!success) throw Error("github/upload-images commitImagesToRepo failed");

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}

export default handler;
