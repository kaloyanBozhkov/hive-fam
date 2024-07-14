import { writeFileSync } from "fs";
import { url } from "inspector";

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

export const getFilesFromUrls = async (urls: string[]) => {
  try {
    const fetched = await Promise.all(
      urls.map(async (url) => ({ [url]: await getFileFromUrl(url) })),
    );
    return fetched.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  } catch (err) {
    console.error("Failed to fetch & convert files to base64s", err);
  }
};
