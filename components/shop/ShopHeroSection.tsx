
"use client"

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="section-container pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-4 block"
        >
          New Season
        </motion.span>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6">
              The Curator's<br />Edit
            </h1>
            <p className="text-black/60 text-base sm:text-lg max-w-sm leading-relaxed">
              A selection of sculptural silhouettes and noble fabrics, designed for the modern atelier. Explore our latest arrivals for the discerning eye.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#" className="group flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-all">
              View Lookbook
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}