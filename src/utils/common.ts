export const getBaseUrl = (useRelativeOnFE = true) => {
  if (typeof window !== "undefined" && useRelativeOnFE)
    // browser should use relative path
    return "";

  if (process.env.NODE_ENV !== "development") {
    if (typeof window !== "undefined") return window.location.origin;
  }

  // assume localhost
  return `http://localhost:3000`;
};

export async function fetchPostJSON<T>(
  url: string,
  data = {},
  headers: NonNullable<Parameters<typeof fetch>["1"]>["headers"] = undefined,
): Promise<T> {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || "Failed to fetch data");
    }

    const resp = (await response.json()) as T;
    return resp;
  } catch (err) {
    console.error("fetchPostJSON:", err);
    if (err instanceof Error) throw new Error(err.message);
    throw err;
  }
}

export async function fetchDeleteJSON<T>(url: string): Promise<T | Error> {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
    });

    if (!response.ok) throw Error("Failed to fetch data");

    return (await response.json()) as T; // parses JSON response into native JavaScript objects
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    throw err;
  }
}

export const encodeGetParams = (p: Record<string, string>) =>
  Object.entries(p)
    .map((kv) => kv.map(encodeURIComponent).join("="))
    .join("&");

export const formatDate = (d: Date) =>
  d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const capitalizeSentence = (s: string) =>
  s.length
    ? s
        .trim()
        .replaceAll(/\s\s+/g, " ")
        .split(" ")
        .reduce(
          (acc, w) => [...acc, w[0]!.toUpperCase() + w.slice(1)],
          [] as string[],
        )
        .join(" ")
    : "";

export const getCoverImgFileNameFromEventTitle = (eventTitle: string) =>
  eventTitle.replaceAll(" ", "_").replaceAll("//", "-").toLowerCase();

export const fetchFileFromUrlFE = async (url: string) => {
  const res = await fetch(url);

  if (res.status !== 200) return null;

  const blob = await res.blob(),
    arrBuffer = await blob.arrayBuffer(),
    buffer = Buffer.from(arrBuffer);

  return buffer;
};

export const forceDownload = (dataURL: string, filename: string) => {
  const a = document.createElement("a");
  a.download = filename;
  a.href = dataURL;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const createUUID = (): string => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export function moveItemInArray<T>(
  array: T[],
  index: number,
  direction: "up" | "down",
): T[] {
  const newArray = [...array]; // Create a shallow copy of the array
  const targetIndex =
    (index + (direction === "up" ? -1 : 1) + newArray.length) % newArray.length; // Calculate the target index with wrap-around

  // Swap the items
  [newArray[index], newArray[targetIndex]] = [
    newArray[targetIndex]!,
    newArray[index]!,
  ];

  return newArray; // Return the new array
}

export const isValidURL = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\\.)+[a-z]{2,}|" + // domain name
      "localhost|" + // localhost
      "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|" + // IP address
      "\\[?[a-f0-9]*:[a-f0-9:%.~]*\\]?)" + // IPv6
      "(\\:\\d+)?(\\/[-a-z0-9+&@#\\/%?=~_|!:,.;]*)*" + // path
      "(\\?[;&a-z0-9+%#=~_|!:,.;]*)?" + // query string
      "(\\#[-a-z0-9+&@#\\/%=~_|!:,.;]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(url);
};
