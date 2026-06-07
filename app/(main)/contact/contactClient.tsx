"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { submitContactInquiry } from "@/app/api/contact/inquiry";
import type { ContactPageContent } from "@/type/contactType";

type Props = {
  content: ContactPageContent;
};

export default function ContactClient({ content }: Props) {
  const {
    title,
    description,
    form,
    officeImageUrl,
    directContact,
    socialLinks,
    locationsHeading,
    locations,
  } = content;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    const result = await submitContactInquiry({ name, email, message });

    setSubmitting(false);

    if (!result.ok) {
      setFeedback({ type: "error", text: result.error });
      return;
    }

    setFeedback({
      type: "success",
      text: `${result.message} Reference: ${result.inquiryNumber}`,
    });
    setName("");
    setEmail("");
    setMessage("");
  }

  const fieldClass =
    "w-full border border-black/10 bg-white px-4 py-3.5 text-sm text-brand-black placeholder:text-black/30 transition-colors focus:border-black/35 focus:outline-none";

  return (
    <div className="section-container py-10 sm:py-14 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* ── Left: intro + form (Strapi: title, description, form) ── */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl"
            >
              {title}
            </motion.h1>

            <p className="max-w-md leading-relaxed text-gray-500">{description}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-sm text-black/70"
                >
                  {form.nameLabel}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={form.namePlaceholder}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-sm text-black/70"
                >
                  {form.emailLabel}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={form.emailPlaceholder}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-sm text-black/70"
              >
                {form.messageLabel}
              </label>
              <textarea
                id="contact-message"
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={form.messagePlaceholder}
                className={`${fieldClass} min-h-[180px] resize-none`}
              />
            </div>

            {feedback ? (
              <p
                role="status"
                className={`text-sm ${
                  feedback.type === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {feedback.text}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-black px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
            >
              {submitting ? "Sending..." : form.submitLabel}
            </button>
          </form>
        </div>

        {/* ── Right: office image + contact details ── */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="aspect-[4/5] overflow-hidden bg-gray-100"
          >
            <img
              src={officeImageUrl}
              alt="Atelier Office"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-12 border-t border-gray-100 pt-12 md:grid-cols-2">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                {directContact.directHeading}
              </h4>

              <div className="space-y-2 font-medium">
                <a
                  href={`mailto:${directContact.email}`}
                  className="block transition-opacity hover:opacity-50"
                >
                  {directContact.email}
                </a>
                <a
                  href={`tel:${directContact.phone.replace(/\s/g, "")}`}
                  className="block transition-opacity hover:opacity-50"
                >
                  {directContact.phone}
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                {directContact.socialsHeading}
              </h4>

              <ul className="space-y-2 font-medium">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Flagship locations ── */}
      <div className="mt-16 space-y-12 sm:mt-24 lg:mt-48 lg:space-y-16">
        <h2 className="font-serif text-4xl md:text-5xl">{locationsHeading}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {locations.map((loc, index) => (
            <motion.div
              key={`${loc.city}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group space-y-6 bg-gray-50 p-6 transition-all duration-500 hover:bg-black hover:text-white sm:p-10"
            >
              <h3 className="font-serif text-2xl">{loc.city}</h3>

              <div className="space-y-1 text-sm font-light opacity-80">
                <p>{loc.address}</p>
                <p>{loc.country}</p>
              </div>

              <div className="space-y-1 border-t border-gray-200 pt-6">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  {loc.hoursLabel}
                </p>
                <p className="text-[10px] font-medium">{loc.hoursTime}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
