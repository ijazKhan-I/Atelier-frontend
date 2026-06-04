"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/type/shopType";
import { BASIC_URL } from "@/app/api/strapi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
const firstImage = Array.isArray(product.image)? product.image[0]: product.image;

const imageUrl = `${BASIC_URL}${firstImage?.url}`;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-6">
        {product.image ? (
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

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold tracking-[0.1em] uppercase mb-1">
            {product.name}
          </h3>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40">
            {product.description}
          </p>
        </div>
        <span className="text-sm font-medium">{`${product.price} PKR`}</span>
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
