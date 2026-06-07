
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ShopHeroSection as ShopHeroContent } from "@/type/shopPageType";

type Props = {
  hero: ShopHeroContent;
};

export default function ShopHeroSection({ hero }: Props) {
  const { badge, headingLines, description, linkLabel, linkUrl } = hero;
  const href = linkUrl || "#";
  const isInternalLink = href.startsWith("/");

  return (
    <section className="section-container pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
      <div className="max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-4 block"
        >
          {badge}
        </motion.span>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6">
              {headingLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < headingLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="text-black/60 text-base sm:text-lg max-w-full sm:max-w-md leading-relaxed">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isInternalLink ? (
              <Link
                href={href}
                className="group flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-all"
              >
                {linkLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <a
                href={href}
                className="group flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-all"
              >
                {linkLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
