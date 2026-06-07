"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TrendingSectionData } from "@/type/homeType";
import TrendingProductCard from "./TrendingProductCard";

const ITEMS_PER_PAGE = 4;

type Props = {
  section: TrendingSectionData;
};

/** Split a list into pages of 4 items for the carousel. */
function chunkIntoPages<T>(items: T[], pageSize: number) {
  const pages: T[][] = [];

  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }

  return pages;
}

export default function TrendingNowSection({ section }: Props) {
  const { heading, description, products } = section;

  const pages = useMemo(
    () => chunkIntoPages(products, ITEMS_PER_PAGE),
    [products]
  );

  const [currentPage, setCurrentPage] = useState(0);
  const hasProducts = products.length > 0;
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < pages.length - 1;

  const nextSlide = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevSlide = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-[#f0efea] py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl">{heading}</h2>
            <p className="text-sm lg:text-base text-brand-black/60">
              {description}
            </p>
          </div>

          {hasProducts && pages.length > 1 && (
            <div className="flex gap-4 self-end sm:self-auto">
              <button
                type="button"
                onClick={prevSlide}
                disabled={!canGoBack}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous trending products"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                disabled={!canGoForward}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next trending products"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {!hasProducts ? (
          <p className="text-sm text-brand-black/50 max-w-xl leading-relaxed">
            No trending products to show. In Strapi, open{" "}
            <strong>Content Manager → Home Page</strong>, pick products under{" "}
            <strong>Trending Products</strong>, then save and publish.
          </p>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {page.map((product) => (
                    <TrendingProductCard
                      key={product.documentId ?? product.id}
                      product={product}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
