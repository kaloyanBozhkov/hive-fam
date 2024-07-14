export const getBaseUrl = (useRelativeOnFE = true) => {
  if (typeof window !== "undefined" && useRelativeOnFE)
    // browser should use relative path
    return "";

  if (process.env.NEXT_PUBLIC_DOMAIN && process.env.NODE_ENV !== "development")
    return process.env.NEXT_PUBLIC_DOMAIN.includes("http")
      ? process.env.NEXT_PUBLIC_DOMAIN
      : `https://${process.env.NEXT_PUBLIC_DOMAIN}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
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
