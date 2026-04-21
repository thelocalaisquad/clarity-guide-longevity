export const toPublicStorageUrl = (url: string | null | undefined) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    parsed.pathname = parsed.pathname.replace(
      "/storage/v1/object/sign/",
      "/storage/v1/object/public/"
    );
    return parsed.toString();
  } catch {
    return url
      .split("?")[0]
      .replace("/storage/v1/object/sign/", "/storage/v1/object/public/");
  }
};

export const withImageCacheBust = (url: string | null | undefined, stamp?: string) => {
  const publicUrl = toPublicStorageUrl(url);
  if (!publicUrl) return "";
  if (publicUrl.includes("?v=") || publicUrl.includes("&v=")) return publicUrl;

  const v = stamp ? new Date(stamp).getTime() : Date.now();
  return `${publicUrl}${publicUrl.includes("?") ? "&" : "?"}v=${v}`;
};