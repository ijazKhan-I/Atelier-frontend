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

  return (
    <div className="section-container py-12 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-24 md:grid-cols-2">
        {/* ── Left: intro + form (Strapi: title, description, form) ── */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-6xl md:text-8xl"
            >
              {title}
            </motion.h1>

            <p className="max-w-md leading-relaxed text-gray-500">{description}</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
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
                  className="w-full border-b border-gray-200 bg-transparent py-3 placeholder:text-gray-300 transition-colors focus:border-black focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
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
                  className="w-full border-b border-gray-200 bg-transparent py-3 placeholder:text-gray-300 transition-colors focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
              >
                {form.messageLabel}
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={form.messagePlaceholder}
                className="w-full resize-none border border-gray-200 bg-transparent p-4 placeholder:text-gray-300 transition-colors focus:border-black focus:outline-none"
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
              className="bg-black px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
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
              className="h-full w-full object-cover grayscale"
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
      <div className="mt-48 space-y-16">
        <h2 className="font-serif text-4xl md:text-5xl">{locationsHeading}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {locations.map((loc, index) => (
            <motion.div
              key={`${loc.city}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group space-y-6 bg-gray-50 p-10 transition-all duration-500 hover:bg-black hover:text-white"
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
