"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { subscribeNewsletter } from "@/app/api/newsletter/subscribe";
import Button from "../ui/button/Button";
import TrendingNowSection from "./TrendingNowSection";
import type { HomeButton, HomeCurationCard, HomePageContent } from "@/type/homeType";

type Props = {
  content: HomePageContent;
};

/** Hero CTA — styled like Button but renders as a link (valid HTML). */
function HomeCtaLink({ button, size = "lg" }: { button: HomeButton; size?: "sm" | "md" | "lg" }) {
  const href = button.buttonHref || "#";
  const sizeClass =
    size === "sm"
      ? "px-4 py-2 text-[10px]"
      : size === "md"
        ? "px-6 py-3 text-[11px]"
        : "px-8 py-4 text-[12px]";
  const variantClass =
    button.variant === "outline"
      ? "border border-white text-white hover:bg-white hover:text-black"
      : "bg-black text-white hover:bg-orange-600";
  const className = `inline-flex items-center justify-center uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${sizeClass} ${variantClass}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {button.buttonLabel}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {button.buttonLabel}
    </a>
  );
}

function CurationCard({
  card,
  motionX,
}: {
  card: HomeCurationCard;
  motionX: number;
}) {
  const imageWrapClass = card.squareImage
    ? "aspect-square overflow-hidden bg-[#151619] flex items-center justify-center p-12"
    : "aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700";

  const imageClass = card.squareImage
    ? "w-full h-full object-contain opacity-80"
    : "w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-1000";

  return (
    <motion.div
      initial={{ opacity: 0, x: motionX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="w-full space-y-8"
    >
      <div className={imageWrapClass}>
        <img
          src={card.imageUrl}
          alt={card.heading}
          className={imageClass}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-600">
          {card.label}
        </span>
        <h2 className="text-3xl lg:text-5xl">{card.heading}</h2>
        <p className="max-w-md text-sm leading-relaxed text-brand-black/60 lg:text-base">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HomeHeroSection({ content }: Props) {
  const { hero, curationPrimary, curationSecondary, trending, philosophy, newsletter } =
    content;

  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const email = subscriberEmail.trim();
    if (!email || !email.includes("@")) {
      setFeedback({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    const result = await subscribeNewsletter({ email });
    setSubmitting(false);

    if (!result.ok) {
      setFeedback({ type: "error", text: result.error });
      return;
    }

    setFeedback({ type: "success", text: result.message });
    if (!result.alreadySubscribed) {
      setSubscriberEmail("");
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero (Strapi: hero component) ── */}
      <section className="relative h-[90vh] overflow-hidden">
        <img
          src={hero.backgroundImageUrl}
          alt={hero.heading}
          className="absolute inset-0 h-full w-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="section-container absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-[10px] font-medium uppercase tracking-[0.4em] lg:text-xs"
          >
            {hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 max-w-4xl text-5xl leading-[1.1] lg:text-8xl"
          >
            {hero.heading}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <HomeCtaLink button={hero.primaryButton} />
            <HomeCtaLink button={hero.secondaryButton} />
          </motion.div>
        </div>
      </section>

      {/* ── Curation grid (Strapi: curationPrimary + curationSecondary) ── */}
      <section className="section-container py-24 lg:py-32">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="flex items-end lg:col-span-7">
            <CurationCard card={curationPrimary} motionX={-50} />
          </div>
          <div className="flex items-end lg:col-span-5">
            <CurationCard card={curationSecondary} motionX={50} />
          </div>
        </div>
      </section>

      {/* ── Trending (Strapi: trendingHeading, trendingDescription, trendingProducts) ── */}
      <TrendingNowSection section={trending} />

      {/* ── Philosophy (Strapi: philosophy component) ── */}
      <section className="bg-brand-black py-32 text-white lg:py-0">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 lg:items-center">
          <div className="space-y-12 py-24 pr-12 lg:py-32 lg:pr-24">
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] opacity-60">
              {philosophy.label}
            </span>
            <h2 className="text-4xl italic leading-tight lg:text-6xl">{philosophy.quote}</h2>
            <p className="max-w-md text-lg leading-relaxed text-white/60">
              {philosophy.description}
            </p>
            <Link
              href={philosophy.linkUrl || "/about"}
              className="group inline-flex items-center space-x-4 border-b border-white/20 pb-2"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                {philosophy.linkLabel}
              </span>
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden lg:h-full">
            <img
              src={philosophy.imageUrl}
              alt={philosophy.label}
              className="h-full w-full object-cover brightness-75"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* ── Newsletter (Strapi: newsletter component) ── */}
      <section className="section-container py-32 text-center">
        <h2 className="mb-6 text-4xl lg:text-5xl">{newsletter.heading}</h2>
        <p className="mb-12 text-brand-black/60">{newsletter.description}</p>
        <form
          className="mx-auto flex max-w-xl flex-col gap-4 border-b border-black pb-2 sm:flex-row"
          onSubmit={handleNewsletterSubmit}
        >
          <input
            id="newsletter-email"
            type="email"
            value={subscriberEmail}
            onChange={(event) => setSubscriberEmail(event.target.value)}
            placeholder={newsletter.inputPlaceholder}
            disabled={submitting}
            required
            className="flex-grow bg-transparent py-3 text-[11px] font-medium uppercase tracking-widest outline-none disabled:opacity-50"
          />
          <Button variant="primary" size="lg" type="submit" disabled={submitting}>
            {submitting ? "Joining…" : newsletter.submitLabel}
          </Button>
        </form>
        {feedback ? (
          <p
            className={`mt-6 text-sm ${
              feedback.type === "success" ? "text-green-700" : "text-red-600"
            }`}
            role="status"
          >
            {feedback.text}
          </p>
        ) : null}
      </section>
    </div>
  );
}
