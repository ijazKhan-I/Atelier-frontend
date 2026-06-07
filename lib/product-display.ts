import type { Product } from "@/type/shopType";
import { getStrapiImageUrl } from "@/lib/strapi-media";

/** First gallery image, or the first variation image as a fallback. */
export function getProductCardImageUrl(product: Product) {
  const galleryImage = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  const galleryUrl = getStrapiImageUrl(galleryImage);
  if (galleryUrl) return galleryUrl;

  const variationImage = product.productVariation?.find((v) => v.image)?.image;
  return getStrapiImageUrl(variationImage);
}

/** Variation price wins when set; otherwise use the base product price. */
export function getProductDisplayPrice(product: Product) {
  const variationPrice = product.productVariation?.find(
    (v) => typeof v.price === "number"
  )?.price;

  return variationPrice ?? product.price;
}

export function formatUsdPrice(price: number) {
  return `$${price.toFixed(2)}`;
}
