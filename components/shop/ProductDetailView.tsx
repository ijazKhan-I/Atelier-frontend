"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Product as StrapiProduct, RichTextBlock, StrapiImage } from "@/type/shopType";
import { addToCart } from "./cartStorage";
import {
  findProductVariation,
  getAvailableStock,
  getStockLabel,
  isVariationInStock,
} from "@/lib/product-stock";
import { toast } from "sonner";

type Props = {
  product: StrapiProduct;
  categoryProducts: StrapiProduct[];
};

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

function resolveMediaUrl(url?: string | null) {
  const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(
    /\/$/,
    ""
  );

  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  return new URL(url, base).toString();
}

function getImageUrl(image?: StrapiImage | null) {
  if (!image) return "";

  return resolveMediaUrl(image.formats?.large?.url ?? image.url);
}

function getGalleryImages(product: StrapiProduct) {
  const images = Array.isArray(product.image)
    ? product.image
    : product.image
    ? [product.image]
    : [];

  const fallback = product.productVariation?.[0]?.image;
  const resolved = images
    .map((image) => getImageUrl(image))
    .filter(Boolean);

  if (resolved.length > 0) return resolved;

  const fallbackUrl = getImageUrl(fallback);
  return fallbackUrl ? [fallbackUrl] : [];
}

function flattenBlocks(blocks?: RichTextBlock[] | null) {
  return (blocks ?? [])
    .flatMap((block) => block.children.map((child) => child.text))
    .flatMap((text) => text.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-black/10 py-6">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-black/55"
      >
        <span>{title}</span>
        {isOpen ? <Minus size={14} strokeWidth={1} /> : <Plus size={14} strokeWidth={1} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 text-sm text-black/60 font-light leading-relaxed space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionText({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;

  const isList = lines.every((line) => line.startsWith("- "));

  if (isList) {
    return (
      <ul className="list-disc pl-4 space-y-3">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^-+\s*/, "")}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function RelatedProductCard({ product }: { product: StrapiProduct }) {
  const firstImage = Array.isArray(product.image) ? product.image[0] : product.image;
  const imageUrl = getImageUrl(firstImage);

  return (
    <Link href={`/shop/${product.documentId}`} className="group block cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        viewport={{ once: true }}
      >
        <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden mb-6 border border-black/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-[0.2em] uppercase text-black/30">
              No image
            </div>
          )}
        </div>

        <div>
          <h3 className="text-[11px] font-sans tracking-wide mb-1">{product.name}</h3>
          <p className="text-[11px] font-medium text-zinc-500">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProductDetailView({ product, categoryProducts }: Props) {
  const router = useRouter();
  const galleryImages = useMemo(() => getGalleryImages(product), [product]);
  const colors = useMemo(() => {
    const seen = new Map<string, { name: string; code: string }>();

    product.productVariation?.forEach((variation) => {
      if (!seen.has(variation.name)) {
        seen.set(variation.name, {
          name: variation.name,
          code: variation.code || "#777777",
        });
      }
    });

    return Array.from(seen.values());
  }, [product]);

  const sizes = useMemo(() => {
    const seen = new Set<string>();

    product.productVariation?.forEach((variation) => {
      if (variation.size) seen.add(variation.size);
    });

    return Array.from(seen);
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(
    () => product.productVariation?.[0]?.size ?? sizes[0] ?? "S"
  );
  const [currentRelatedPage, setCurrentRelatedPage] = useState(0);

  const sizesForSelectedColor = useMemo(() => {
    if (!selectedColor) return sizes;

    const colorSizes = new Set<string>();
    product.productVariation?.forEach((variation) => {
      if (variation.name === selectedColor && variation.size) {
        colorSizes.add(variation.size);
      }
    });

    return colorSizes.size > 0 ? Array.from(colorSizes) : sizes;
  }, [product, selectedColor, sizes]);

  const selectedVariation = useMemo(() => {
    return findProductVariation(product, selectedColor, selectedSize);
  }, [product, selectedColor, selectedSize]);

  const availableStock = useMemo(
    () => getAvailableStock(product, selectedColor, selectedSize),
    [product, selectedColor, selectedSize]
  );

  const inStock = availableStock > 0;
  const stockLabel = getStockLabel(availableStock);

  const displayPrice = selectedVariation?.price ?? product.price;
  const breadcrumbCategory = product.category?.name?.toUpperCase() ?? "PRODUCT";

  const descriptionLines = product.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const shippingLines = flattenBlocks(product.shipping_info);
  const returnLines = flattenBlocks(product.return_policy);
  const artisanLines = flattenBlocks(product.artisan_notes);

  const selectedVariationImageUrl = selectedColor ? getImageUrl(selectedVariation?.image) : "";

  const visibleImages = useMemo(() => {
    const images = [...galleryImages];

    if (selectedVariationImageUrl && !images.includes(selectedVariationImageUrl)) {
      images.unshift(selectedVariationImageUrl);
    }

    return images.length > 0 ? images : [""];
  }, [galleryImages, selectedVariationImageUrl]);

  const mainImage = visibleImages[activeImageIndex] ?? visibleImages[0] ?? "";

  const relatedPages = useMemo(() => {
    const itemsPerPage = 4;
    const pages: StrapiProduct[][] = [];

    for (let i = 0; i < categoryProducts.length; i += itemsPerPage) {
      pages.push(categoryProducts.slice(i, i + itemsPerPage));
    }

    return pages;
  }, [categoryProducts]);

  const nextRelatedPage = () => {
    setCurrentRelatedPage((prev) => Math.min(prev + 1, relatedPages.length - 1));
  };

  const prevRelatedPage = () => {
    setCurrentRelatedPage((prev) => Math.max(prev - 1, 0));
  };

  const handleAddToBag = () => {
    if (!inStock) {
      toast.error("This variant is out of stock.");
      return;
    }

    const added = addToCart({
      id: product.id,
      documentId: product.documentId,
      name: product.name,
      price: displayPrice,
      image: mainImage,
      color: selectedColor || "Default",
      size: selectedSize,
      maxStock: availableStock,
    });

    if (!added) {
      toast.error("This variant is out of stock.");
      return;
    }

    router.push("/cart");
  };

  return (
    <div className="bg-white text-black pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5]   relative border border-black/10"
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-fill"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-black/30">
                  No image
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {(visibleImages.slice(1, 3).length > 0
                ? visibleImages.slice(1, 3)
                : [visibleImages[0], visibleImages[0]]
              ).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index + 1)}
                  className="aspect-square bg-[#f5f5f5] overflow-hidden border border-black/10"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  ) : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveImageIndex(visibleImages.length - 1)}
              className="aspect-[16/9] bg-gradient-to-br from-zinc-100 via-white to-zinc-100 overflow-hidden flex items-center justify-center p-10 border border-black/10 w-full"
            >
              {visibleImages[3] ? (
                <img
                  src={visibleImages[3]}
                  alt={`${product.name} detail`}
                  className="w-full h-full object-cover rounded-3xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-black/5 rounded-3xl backdrop-blur-3xl shadow-2xl flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
                </div>
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <nav className="text-[10px] uppercase tracking-[0.2em] text-black/35 mb-8 font-sans">
              SHOP / {breadcrumbCategory}
            </nav>

            <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-[1.1]">
              {product.name}
            </h1>
            <p className="text-xl font-light mb-12">${displayPrice.toFixed(2)}</p>

            <div className="mb-10 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/55">
                COLOR - {selectedColor ? selectedColor.toUpperCase() : "DEFAULT"}
              </span>
              <div className="flex gap-4 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      const sizesForColor =
                        product.productVariation
                          ?.filter((variation) => variation.name === color.name && variation.size)
                          .map((variation) => variation.size) ?? [];

                      setSelectedColor(color.name);
                      setSelectedSize((currentSize) =>
                        sizesForColor.includes(currentSize)
                          ? currentSize
                          : sizesForColor[0] ?? currentSize
                      );
                      setActiveImageIndex(0);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      selectedColor === color.name ? "border-black" : "border-black/20"
                    }`}
                    aria-label={color.name}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color.code }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium">
                <span className="text-black/55">SIZE</span>
                <button type="button" className="text-black/35 font-medium tracking-widest">
                  SIZE GUIDE
                </button>
              </div>
              <div className="grid grid-cols-4 border border-black/15">
                {sizesForSelectedColor.map((size) => {
                  const sizeInStock = isVariationInStock(product, selectedColor, size);

                  return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setActiveImageIndex(0);
                    }}
                    disabled={!sizeInStock}
                    className={`py-5 text-[10px] tracking-widest border-r last:border-r-0 border-black/15 transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-transparent text-black hover:bg-black/5"
                    }`}
                  >
                    {size}
                  </button>
                  );
                })}
              </div>
              <p
                className={`text-[10px] uppercase tracking-[0.2em] ${
                  inStock ? "text-black/45" : "text-red-600"
                }`}
              >
                {stockLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToBag}
              disabled={!inStock}
              className="w-full bg-black text-white text-[11px] uppercase tracking-[0.4em] font-medium py-6 mb-16 hover:bg-zinc-900 active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:bg-black/35"
            >
              {inStock ? "Add to Bag" : "Out of Stock"}
            </button>

            <div className="space-y-0">
              <Accordion title="Description" defaultOpen>
                <SectionText lines={descriptionLines} />
              </Accordion>
              <Accordion title="Shipping & Returns">
                <SectionText lines={shippingLines.length > 0 ? shippingLines : returnLines} />
              </Accordion>
              <Accordion title="Artisan Notes">
                <SectionText lines={artisanLines} />
              </Accordion>
            </div>
          </div>
        </div>

        {categoryProducts.length > 0 && (
          <section id="cross-sell-section" className="border-t border-black/10 pt-24">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-black/35 font-bold mb-4 block">
                  {breadcrumbCategory}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif">
                  More from {product.category?.name ?? "this category"}
                </h2>
                <p className="mt-4 text-sm md:text-base text-black/60">
                  Related pieces from the same category.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevRelatedPage}
                  disabled={currentRelatedPage === 0}
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} strokeWidth={1} />
                </button>
                <button
                  type="button"
                  onClick={nextRelatedPage}
                  disabled={currentRelatedPage === relatedPages.length - 1}
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} strokeWidth={1} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentRelatedPage * 100}%)` }}
              >
                {relatedPages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                  >
                    {page.map((item, idx) => (
                      <motion.div
                        key={item.documentId ?? item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <RelatedProductCard product={item} />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
