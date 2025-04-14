import { writeFileSync } from "fs";
import { headers } from "next/headers";

export const saveFileFromUrl = async (url: string, path: string) => {
  try {
    const resp = await fetch(url);
    const buff = await resp.arrayBuffer();
    writeFileSync(path + `/${url.trim()}`, Buffer.from(buff));
  } catch (err) {
    console.error("Failed to fetch & save file from url", err);
  }
};

export const getFileFromUrl = async (url: string) => {
  try {
    const resp = await fetch(url);
    const buff = await resp.arrayBuffer();
    return Buffer.from(buff).toString("base64");
  } catch (err) {
    console.error("Failed to fetch or convert to base64", err);
  }
};

export const saveFilesFromUrls = async (urls: string[], path: string) => {
  try {
    for (const url of urls) {
      await saveFileFromUrl(url, path);
    }
  } catch (err) {
    console.error("Failed to fetch & save files from urls", err);
  }
};

type FileName = string;
type ImgUrl = string;
type Base64 = string;

export const getFilesFromUrls = async (urls: Record<FileName, ImgUrl>) => {
  try {
    const fetched = await Promise.all(
      Object.entries(urls).map(async ([fileName, url]) => ({
        [fileName]: await getFileFromUrl(url),
      })),
    );
    return fetched.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {} as Record<FileName, Base64 | undefined>,
    );
  } catch (err) {
    console.error("Failed to fetch & convert files to base64s", err);
  }
};

export const getPathname = async () => {
  "use server";
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  return pathname;
};
