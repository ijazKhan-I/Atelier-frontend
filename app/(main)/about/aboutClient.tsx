"use client";

import Link from "next/link";
import type { AboutPageContent, AboutPillarStyle } from "@/type/aboutType";

type Props = {
  content: AboutPageContent;
};

const PILLAR_STYLES: Record<
  AboutPillarStyle,
  { container: string; title: string; text: string }
> = {
  white: {
    container:
      "flex min-h-0 flex-col justify-between bg-white p-6 sm:p-10 lg:min-h-[500px] lg:p-16 xl:p-20",
    title: "font-serif text-3xl lg:text-4xl",
    text: "max-w-md text-sm leading-relaxed text-brand-black/60 lg:text-[15px]",
  },
  black: {
    container:
      "flex min-h-0 flex-col justify-center bg-brand-black p-6 text-white sm:p-10 lg:min-h-[500px] lg:p-16 xl:p-20",
    title: "font-serif text-3xl lg:text-4xl",
    text: "max-w-md text-sm leading-relaxed text-white/60 lg:text-[15px]",
  },
  gray: {
    container:
      "flex min-h-0 flex-col justify-center bg-[#efefef] p-6 sm:p-10 lg:min-h-[260px] lg:p-16 xl:p-20",
    title: "font-serif text-xl uppercase tracking-[0.18em] lg:text-2xl",
    text: "max-w-sm text-sm leading-relaxed text-brand-black/60",
  },
};

export default function AboutClient({ content }: Props) {
  const { hero, heritage, process, pillarsHeading, pillars, uniform } = content;

  return (
    <div className="min-h-screen bg-white text-brand-black">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden bg-black sm:h-[78vh] sm:min-h-[560px]">
        <img
          src={hero.backgroundImageUrl}
          alt={hero.title}
          className="h-full w-full object-cover object-[center_18%] grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="mb-5 font-serif text-4xl tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
            {hero.title}
          </h1>
          <span className="text-[10px] font-medium uppercase tracking-[0.45em] text-white/75 lg:text-[11px]">
            {hero.subtitle}
          </span>
        </div>
      </section>

      {/* Heritage */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <h2 className="mb-12 text-center font-serif text-4xl lg:mb-16 lg:text-5xl">
            {heritage.title}
          </h2>
          <div className="mx-auto max-w-xl space-y-8 text-left">
            <p className="text-sm font-light leading-[1.9] text-brand-black/70 lg:text-base">
              {heritage.paragraphOne}
            </p>
            <p className="text-sm font-light leading-[1.9] text-brand-black/70 lg:text-base">
              {heritage.paragraphTwo}
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-[#f4f3f0]">
        <div className="section-container">
          <div className="grid grid-cols-1 items-end gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-28">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden bg-[#eceae6]">
                <img
                  src={process.imageUrl}
                  alt={process.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 right-0 max-w-[220px] bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:-bottom-8 sm:-right-4 sm:max-w-[240px] lg:-bottom-10 lg:-right-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  {process.cardLabel}
                </p>
                <p className="mt-4 text-xs italic leading-relaxed text-brand-black/60">
                  {process.cardQuote}
                </p>
              </div>
            </div>

            <div className="space-y-7 pb-4 lg:pb-10 lg:pt-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-black/45">
                {process.label}
              </span>
              <h2 className="max-w-md font-serif text-3xl leading-[1.05] sm:text-4xl lg:text-6xl">
                {process.title}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-brand-black/60 lg:text-[15px]">
                {process.description}
              </p>
              <Link
                href={process.linkUrl || "/shop"}
                className="inline-flex border-b border-brand-black pb-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-50"
              >
                {process.linkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <h2 className="mb-10 text-center font-serif text-3xl sm:mb-16 sm:text-4xl lg:mb-24 lg:text-7xl">
            {pillarsHeading}
          </h2>

          <div className="grid grid-cols-1 border border-black/5 lg:grid-cols-2">
            {pillars.map((pillar, index) => {
              const styles = PILLAR_STYLES[pillar.style] ?? PILLAR_STYLES.white;
              const isTopRow = index < 2;

              return (
                <div
                  key={`${pillar.title}-${index}`}
                  className={`${styles.container} ${
                    index % 2 === 0 ? "lg:border-r lg:border-black/5" : ""
                  } ${isTopRow ? "lg:border-b lg:border-black/5" : ""} ${
                    index === 2 ? "lg:border-r lg:border-black/5" : ""
                  }`}
                >
                  <div className={pillar.style === "white" ? "space-y-6" : "space-y-4"}>
                    <h3 className={styles.title}>{pillar.title}</h3>
                    <p className={styles.text}>{pillar.description}</p>
                  </div>

                  {pillar.imageUrl ? (
                    <div className="mt-10 aspect-[16/7] overflow-hidden">
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

      {/* Modern Uniform */}
      <section className="bg-[#e5e5e5]">
        <div className="grid min-h-0 grid-cols-1 md:min-h-[560px] md:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden bg-[#e5e5e5] sm:min-h-[420px] md:min-h-[560px]">
            <img
              src={uniform.leftImageUrl}
              alt={uniform.title}
              className="absolute inset-0 h-full w-full object-contain p-10 mix-blend-multiply md:p-14 lg:p-16"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-8 text-white md:p-12 lg:p-16">
              <h2 className="max-w-sm font-serif text-4xl leading-[1.02] lg:text-6xl">
                {uniform.title}
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/90 lg:text-[15px]">
                {uniform.description}
              </p>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden bg-[#e5e5e5] sm:min-h-[420px] md:min-h-[560px]">
            <img
              src={uniform.rightImageUrl}
              alt="Uniform piece"
              className="absolute inset-0 h-full w-full object-contain p-10 mix-blend-multiply md:p-14 lg:p-16"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
