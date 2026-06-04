"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-serif"
            >
              Get in Touch
            </motion.h1>

            <p className="text-gray-500 max-w-md leading-relaxed">
              Whether you seek personalized styling advice or have inquiries
              regarding our latest collection, our atelier concierge is at your
              service.
            </p>
          </div>

          <form
            className="space-y-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                Message
              </label>

              <textarea
                rows={4}
                placeholder="How can we assist you?"
                className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-300 resize-none"
              />
            </div>

            <button className="bg-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors">
              Send Inquiry
            </button>
          </form>
        </div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="aspect-[4/5] bg-gray-100 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
              alt="Atelier Office"
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                Direct Communication
              </h4>

              <div className="space-y-2 font-medium">
                <p className="hover:opacity-50 transition-opacity cursor-pointer">
                  atelier@gmail.com
                </p>

                <p className="hover:opacity-50 transition-opacity cursor-pointer">
                  +92 3144763488
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                Our Socials
              </h4>

              <ul className="space-y-2 font-medium">
                <li className="hover:opacity-50 transition-opacity cursor-pointer">
                  Instagram
                </li>

                <li className="hover:opacity-50 transition-opacity cursor-pointer">
                  Pinterest
                </li>

                <li className="hover:opacity-50 transition-opacity cursor-pointer">
                  LinkedIn
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-48 space-y-16">
        <h2 className="text-4xl md:text-5xl font-serif">
          Flagship Locations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              city: "Peshawar",
              address: "Phase 3, Street 8",
              country: "Peshawar, Pakistan",
              hours: "Monday — Saturday",
              time: "10:00 — 19:00",
            },
            {
              city: "Islamabad",
              address: "F11 Markaz",
              country: "Islamabad, Pakistan",
              hours: "Monday — Saturday",
              time: "10:00 — 18:30",
            },
            {
              city: "Lahore",
              address: "Johar Town",
              country: "Lahore, Pakistan",
              hours: "Monday — Sunday",
              time: "11:00 — 20:00",
            },
          ].map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-10 space-y-6 group hover:bg-black hover:text-white transition-all duration-500"
            >
              <h3 className="text-2xl font-serif">{loc.city}</h3>

              <div className="space-y-1 text-sm font-light opacity-80">
                <p>{loc.address}</p>
                <p>{loc.country}</p>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-1">
                <p className="text-[9px] uppercase font-bold tracking-widest opacity-60">
                  {loc.hours}
                </p>

                <p className="text-[10px] font-medium">{loc.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}