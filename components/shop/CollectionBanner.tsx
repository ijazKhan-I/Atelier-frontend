
"use client"

import { motion } from 'framer-motion';

export default function CollectionBanner() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1485628390555-1a7bd503f9fe?q=80&w=2070&auto=format&fit=crop" 
          alt="Brutalist Collection"
          className="w-full h-full object-cover grayscale brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 text-center text-white section-container">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase mb-6 block"
        >
          Fall / Winter 2024
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold mb-10 leading-tight"
        >
        The Brutalist<br />Collection
        </motion.h2>
        
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
        >
          <a href="#" className="inline-block border border-white/40 px-10 py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
            Explore Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
