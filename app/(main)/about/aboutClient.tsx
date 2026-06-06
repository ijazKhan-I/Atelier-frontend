"use client";

import Link from "next/link";
import type { AboutPageContent, AboutPillarStyle } from "@/type/aboutType";

type Props = {
  content: AboutPageContent;
};

/** Tailwind classes for each pillar cell style from Strapi. */
const PILLAR_STYLES: Record<
  AboutPillarStyle,
  { container: string; title: string; text: string }
> = {
  white: {
    container: "flex flex-col justify-between bg-white p-12 lg:p-24",
    title: "font-serif text-3xl lg:text-4xl",
    text: "max-w-sm text-sm leading-relaxed text-brand-black/60 lg:text-base",
  },
  black: {
    container: "flex flex-col justify-center bg-brand-black p-12 text-white lg:p-24",
    title: "font-serif text-3xl lg:text-4xl",
    text: "max-w-sm text-sm leading-relaxed text-white/60 lg:text-base",
  },
  gray: {
    container: "bg-[#f0f0f0] p-12 lg:p-24",
    title: "font-serif text-2xl lg:text-3xl",
    text: "max-w-sm text-sm leading-relaxed text-brand-black/60",
  },
};

export default function AboutClient({ content }: Props) {
  const { hero, heritage, process, pillarsHeading, pillars, uniform } = content;

  return (
    <div className="-mt-20 min-h-screen bg-brand-offwhite text-brand-black">
      {/* ── Hero (Strapi: hero component) ── */}
      <section className="relative h-[90vh] overflow-hidden bg-black">
        <img
          src={hero.backgroundImageUrl}
          alt={hero.title}
          className="h-full w-full scale-105 object-cover object-[center_15%] opacity-60 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="mb-6 font-serif text-6xl tracking-tight lg:text-8xl xl:text-9xl">
            {hero.title}
          </h1>
          <span className="text-[10px] font-medium uppercase tracking-[0.5em] opacity-60 lg:text-xs">
            {hero.subtitle}
          </span>
        </div>
      </section>

      {/* ── Heritage (Strapi: heritage component) ── */}
      <section className="section-container space-y-12 py-24 text-center lg:py-48">
        <h2 className="font-serif text-4xl lg:text-5xl">{heritage.title}</h2>
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="text-sm font-light leading-relaxed text-brand-black/70 lg:text-lg">
            {heritage.paragraphOne}
          </p>
          <p className="text-sm font-light leading-relaxed text-brand-black/70 lg:text-lg">
            {heritage.paragraphTwo}
          </p>
        </div>
      </section>

      {/* ── Process (Strapi: process component) ── */}
      <section className="section-container pb-24 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={process.imageUrl}
                alt={process.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-6 hidden max-w-[240px] bg-white p-10 shadow-2xl lg:block">
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {process.cardLabel}
              </p>
              <p className="mt-4 text-xs italic leading-relaxed text-brand-black/60">
                {process.cardQuote}
              </p>
            </div>
          </div>

          <div className="space-y-8 lg:pt-16">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-black/45">
              {process.label}
            </span>
            <h2 className="max-w-md font-serif text-4xl leading-tight lg:text-6xl">
              {process.title}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-brand-black/60 lg:text-base">
              {process.description}
            </p>
            <Link
              href={process.linkUrl || "/shop"}
              className="inline-flex items-center gap-1 border-b border-brand-black pb-2 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-50"
            >
              {process.linkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pillars (Strapi: pillarsHeading + pillars repeatable component) ── */}
      <section className="bg-white py-24 lg:py-48">
        <div className="section-container">
          <h2 className="mb-24 text-center font-serif text-5xl lg:mb-32 lg:text-7xl">
            {pillarsHeading}
          </h2>

          <div className="grid grid-cols-1 items-stretch gap-px bg-black/5 lg:grid-cols-2">
            {pillars.map((pillar, index) => {
              const styles = PILLAR_STYLES[pillar.style] ?? PILLAR_STYLES.white;

              return (
                <div key={`${pillar.title}-${index}`} className={styles.container}>
                  <div className={pillar.style === "white" ? "space-y-8" : "space-y-4"}>
                    <h3 className={styles.title}>{pillar.title}</h3>
                    <p className={styles.text}>{pillar.description}</p>
                  </div>

                  {/* Optional image — used by Sustainability pillar in the design */}
                  {pillar.imageUrl ? (
                    <div className="mt-10 aspect-[16/6] overflow-hidden opacity-90">
                      <img
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Uniform (Strapi: uniform component) ── */}
      <section className="relative bg-[#e5e5e5]">
        <div className="grid min-h-[480px] grid-cols-1 md:min-h-[540px] md:grid-cols-2">
          <div className="flex aspect-[4/5] items-center justify-center bg-[#e5e5e5] p-8 md:aspect-auto md:min-h-[540px] md:p-12">
            <img
              src={uniform.leftImageUrl}
              alt={uniform.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex aspect-[4/5] items-center justify-center bg-[#e5e5e5] p-8 md:aspect-auto md:min-h-[540px] md:p-12">
            <img
              src={uniform.rightImageUrl}
              alt="Uniform piece"
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-t from-black/55 via-black/15 to-transparent md:w-1/2" />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full flex-col justify-end p-8 md:w-1/2 md:p-14 lg:p-20">
          <div className="max-w-md text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            <h2 className="font-serif text-4xl leading-none lg:text-6xl xl:text-7xl">
              {uniform.title}
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/90 lg:text-base">
              {uniform.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
