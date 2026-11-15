import type { StrapiImage } from "@/type/shopType";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");

/** Turn a media path into a full URL the browser can load. */
export function resolveStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return new URL(url, API_BASE).toString();
}

/** Pick the best available image URL from a media object. */
export function getStrapiImageUrl(image?: StrapiImage | null) {
  if (!image) return "";
  return resolveStrapiMediaUrl(image.formats?.large?.url ?? image.url);
}
