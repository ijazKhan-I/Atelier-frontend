import type { StrapiImage } from "@/type/shopType";

const STRAPI_BASE = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
).replace(/\/$/, "");

/** Turn a Strapi media path into a full URL the browser can load. */
export function resolveStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return new URL(url, STRAPI_BASE).toString();
}

/** Pick the best available image URL from a Strapi media object. */
export function getStrapiImageUrl(image?: StrapiImage | null) {
  if (!image) return "";
  return resolveStrapiMediaUrl(image.formats?.large?.url ?? image.url);
}
