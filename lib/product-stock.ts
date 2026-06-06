import type { Product, ProductVariation } from "@/type/shopType";

function normalizeLabel(value?: string | null) {
  return String(value ?? "").trim();
}

export function getVariationStock(variation?: ProductVariation | null) {
  if (typeof variation?.stock !== "number" || Number.isNaN(variation.stock)) {
    return 0;
  }

  return Math.max(0, variation.stock);
}

export function findProductVariation(
  product: Product,
  color?: string,
  size?: string
): ProductVariation | undefined {
  const variations = product.productVariation ?? [];
  if (!variations.length) return undefined;

  const normalizedColor = normalizeLabel(color);
  const normalizedSize = normalizeLabel(size);

  if (normalizedColor && normalizedSize) {
    const exact = variations.find(
      (variation) =>
        normalizeLabel(variation.name) === normalizedColor &&
        normalizeLabel(variation.size) === normalizedSize
    );
    if (exact) return exact;
  }

  if (normalizedColor.toLowerCase() === "default" && normalizedSize) {
    const bySize = variations.find(
      (variation) => normalizeLabel(variation.size) === normalizedSize
    );
    if (bySize) return bySize;
  }

  if (normalizedColor) {
    const byColor = variations.find(
      (variation) => normalizeLabel(variation.name) === normalizedColor
    );
    if (byColor) return byColor;
  }

  if (normalizedSize) {
    const bySizeOnly = variations.find(
      (variation) => normalizeLabel(variation.size) === normalizedSize
    );
    if (bySizeOnly) return bySizeOnly;
  }

  return variations.length === 1 ? variations[0] : undefined;
}

export function getAvailableStock(product: Product, color?: string, size?: string) {
  return getVariationStock(findProductVariation(product, color, size));
}

export function isVariationInStock(product: Product, color?: string, size?: string) {
  return getAvailableStock(product, color, size) > 0;
}

export function isProductInStock(product: Product) {
  return (product.productVariation ?? []).some((variation) => getVariationStock(variation) > 0);
}

export function getProductTotalStock(product: Product) {
  return (product.productVariation ?? []).reduce(
    (sum, variation) => sum + getVariationStock(variation),
    0
  );
}

export function getStockLabel(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left in stock`;
  return `${stock} in stock`;
}
