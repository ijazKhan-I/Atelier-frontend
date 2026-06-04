import Link from "next/link";
import type { Product } from "@/type/shopType";
import {
  formatUsdPrice,
  getProductCardImageUrl,
  getProductDisplayPrice,
} from "@/lib/product-display";

type Props = {
  product: Product;
};

export default function TrendingProductCard({ product }: Props) {
  const imageUrl = getProductCardImageUrl(product);
  const priceLabel = formatUsdPrice(getProductDisplayPrice(product));
  const categoryName = product.category?.name ?? "Collection";

  const content = (
    <>
      <div className="aspect-[3/4] overflow-hidden mb-6 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/5 text-[10px] uppercase tracking-widest text-brand-black/30">
            No image
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-1">
            {categoryName}
          </p>
          <h3 className="text-lg font-serif">{product.name}</h3>
        </div>
        <span className="text-sm font-medium shrink-0">{priceLabel}</span>
      </div>
    </>
  );

  if (!product.documentId) {
    return <div className="group cursor-default">{content}</div>;
  }

  return (
    <Link
      href={`/shop/${product.documentId}`}
      className="group block cursor-pointer"
    >
      {content}
    </Link>
  );
}
