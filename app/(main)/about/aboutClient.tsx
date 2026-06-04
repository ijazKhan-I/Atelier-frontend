
"use client"

import { motion,Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface AboutProps {
  onBackToHome: () => void;
}

export default function About() {
 const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

  return (
    <div className="min-h-screen bg-brand-offwhite">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden bg-black">
        <img 
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop" 
          alt="About Hero" 
          className="w-full h-full object-cover opacity-60 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white section-container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-6xl lg:text-9xl mb-6 font-serif tracking-tight"
          >
            Manifesto of Form
          </motion.h1>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="text-[10px] lg:text-[12px] uppercase tracking-[0.5em] font-medium"
          >
            Autumn / Winter MMXXIV
          </motion.span>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section-container py-24 lg:py-48 text-center space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl">The Heritage of Silence</motion.h2>
          <motion.p variants={itemVariants} className="text-brand-black/70 leading-relaxed text-sm lg:text-lg font-light">
            Founded in 1994, Atelier began as a singular vision: to create garments that whisper rather than shout. 
            In an age of fast consumption, we chose the path of the artisan, where time is the ultimate luxury.
          </motion.p>
          <motion.p variants={itemVariants} className="text-brand-black/70 leading-relaxed text-sm lg:text-lg font-light">
            Our philosophy is rooted in the concept of "Quiet Luxury"—the intersection of impeccable tailoring and 
            the world's finest raw materials. Every piece is a dialogue between the wearer and the craft.
          </motion.p>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="section-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-4/5 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                alt="The Process"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 bg-white p-12 hidden lg:block shadow-2xl max-w-xs">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-4">001 / THE STITCH</p>
              <p className="text-xs text-brand-black/60 leading-relaxed italic">"Hand-finished seams in every silhouette."</p>
            </div>
          </motion.div>
          
          <div className="space-y-8">
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-orange-600">The Process</span>
            <h2 className="text-4xl lg:text-6xl max-w-md leading-tight">Artistry in the Details</h2>
            <p className="text-brand-black/60 leading-relaxed max-w-sm">
              Our ateliers in Tuscany employ third-generation tailors who treat every seam as a work of art. 
              We source only GOTS-certified silks and LWG-gold rated leathers, ensuring that our commitment 
              to the planet matches our commitment to quality.
            </p>
            <button className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold border-b border-black pb-2 hover:opacity-50 transition-opacity">
              Discover the Atelier <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-white py-24 lg:py-48">
        <div className="section-container">
          <h2 className="text-5xl lg:text-7xl text-center mb-24 lg:mb-32">Our Pillars</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/5 items-stretch">
            <div className="bg-white p-12 lg:p-24 space-y-8">
              <h3 className="text-3xl lg:text-4xl">Sustainability</h3>
              <p className="text-sm lg:text-base text-brand-black/60 leading-relaxed max-w-sm">
                A circular approach to fashion. We offer lifetime repairs on all garments to ensure they remain in your wardrobe, not the landfill.
              </p>
              <div className="aspect-16/6 overflow-hidden grayscale opacity-80">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Fabric detail" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="bg-brand-black text-white p-12 lg:p-24 space-y-8 flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-3xl lg:text-4xl">Radical Integrity</h3>
                <p className="text-sm lg:text-base text-white/60 leading-relaxed max-w-sm">
                  From our supply chain to our showroom floor, we maintain 100% transparency. Know who made your clothes and why they chose each material.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-12 border-t border-white/10">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold opacity-40">Timelessness</span>
                  <p className="text-[11px] leading-relaxed opacity-60">Designing for the future, respecting the past. Trends fade; style is eternal.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold opacity-40">Curation</span>
                  <p className="text-[11px] leading-relaxed opacity-60">A limited production model. We create only what is needed, focusing on excellence over volume.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uniform Section */}
      <section className="section-container py-24 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-7xl leading-none">Defining the Modern Uniform</h2>
            <p className="text-lg text-brand-black/60 max-w-sm">
              A modular wardrobe designed for the global citizen. Effortless, adaptable, and unmistakably Atelier.
            </p>
          </div>
          <div className="flex gap-4 lg:gap-8">
            <div className="flex-1 aspect-3/4 bg-[#f2f2f2] flex items-center justify-center p-8">
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop" 
                alt="Uniform Piece 1" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 aspect-3/4 bg-[#f2f2f2] flex items-center justify-center p-8">
              <img 
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2010&auto=format&fit=crop" 
                alt="Uniform Piece 2" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer/Back CTA */}
      <section className="section-container py-24 text-center border-t border-black/5">
        <button 
         
          className="text-[11px] uppercase tracking-[0.4em] font-bold hover:opacity-50 transition-opacity"
        >
          Return to Archive
        </button>
      </section>
    </div>
  );
}