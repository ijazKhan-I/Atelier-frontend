"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/type/shopType";
import { getProductCardImageUrl } from "@/lib/product-display";
import { isProductInStock } from "@/lib/product-stock";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductCardImageUrl(product);
  const inStock = isProductInStock(product);

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-6">
        {!inStock ? (
          <span className="absolute left-4 top-4 z-10 bg-black px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
            Out of Stock
          </span>
        ) : null}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/5 text-[10px] font-bold tracking-[0.2em] uppercase text-black/30">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-sm font-bold tracking-[0.1em] uppercase mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 line-clamp-2">
            {product.description}
          </p>
        </div>
        <span className="text-sm font-medium shrink-0">{`${product.price} PKR`}</span>
      </div>
    </motion.div>
  );

  if (!product.documentId) {
    return card;
  }

  return (
    <Link href={`/shop/${product.documentId}`} className="block">
      {card}
    </Link>
  );
}
