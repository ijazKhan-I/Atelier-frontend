"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/button/Button";
import TrendingNowSection from "./TrendingNowSection";
import type { TrendingSectionData } from "@/type/homeType";

type Props = {
  trendingSection: TrendingSectionData;
};

export default function HomeHeroSection({ trendingSection }: Props) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      {/* <nav className="fixed top-0 w-full z-50 bg-brand-offwhite/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <a href="/" className="text-2xl font-serif tracking-tighter uppercase font-bold">Atelier</a>
            <div className="hidden lg:flex space-x-8">
              <a href="#" className="nav-link !opacity-100 border-b border-black pb-1">Home</a>
              <a href="#" className="nav-link">Shop</a>
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 opacity-70 hover:opacity-100 transition-opacity"><Search size={18} /></button>
            <button className="p-2 opacity-70 hover:opacity-100 transition-opacity"><User size={18} /></button>
            <button className="relative p-2 opacity-70 hover:opacity-100 transition-opacity">
              <ShoppingBag size={18} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-brand-black text-white text-[7px] flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </nav> */}

     
      {/* Hero Section */}
<section className="relative h-[90vh] overflow-hidden">
  <img
    src="/assets/home_hero_img.png"
    alt="Hero Fashion"
    className="absolute inset-0 h-full w-full object-cover object-center"
    referrerPolicy="no-referrer"
  />

  <div className="absolute inset-0 bg-black/20" />

  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white section-container">
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-[10px] lg:text-[12px] uppercase tracking-[0.4em] font-medium mb-6"
    >
      Autumn / Winter 2024
    </motion.span>

    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-5xl lg:text-8xl mb-12 max-w-4xl leading-[1.1]"
    >
      The Art of Stillness
    </motion.h1>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Button variant="primary" size="lg">
        Shop Now
      </Button>
      <Button variant="outline" size="lg">
        Discover More
      </Button>
    </motion.div>
  </div>
</section>

       {/* Curation Section */}
<section className="section-container py-24 lg:py-32">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end">
    
    {/* Left Column */}
    <div className="lg:col-span-7 flex items-end">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="w-full space-y-8"
      >
        <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
          <img
            src="/assets/home_fession.png"
            alt="Structured Elegance"
            className="w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-orange-600">
            Curation 01
          </span>

          <h2 className="text-3xl lg:text-5xl">
            Structured Elegance
          </h2>

          <p className="text-sm lg:text-base text-brand-black/60 max-w-md leading-relaxed">
            Exploring the intersection of modern geometry and traditional
            tailoring techniques.
          </p>
        </div>
      </motion.div>
    </div>

    {/* Right Column */}
    <div className="lg:col-span-5 flex items-end">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="w-full space-y-8"
      >
        <div className="aspect-square overflow-hidden bg-[#151619] flex items-center justify-center p-12">
          <img
            src="/assets/home_style.png"
            alt="The Minimalist Essential"
            className="w-full h-full object-contain opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-orange-600">
            Curation 02
          </span>

          <h2 className="text-3xl lg:text-4xl">
            The Minimalist Essential
          </h2>

          <p className="text-sm lg:text-base text-brand-black/60 max-w-sm leading-relaxed">
            Timeless pieces designed for the discerning individual.
          </p>
        </div>
      </motion.div>
    </div>

  </div>
</section>
        <TrendingNowSection section={trendingSection} />

        {/* Philosophy Section */}
        <section className="bg-brand-black text-white py-32 lg:py-0">
          <div className="section-container grid grid-cols-1 lg:grid-cols-2 lg:items-center">
            <div className="py-24 lg:py-32 pr-12 lg:pr-24 space-y-12">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium opacity-60">Our Philosophy</span>
              <h2 className="text-4xl lg:text-6xl leading-tight italic">
                "Beauty lies in the omission of the unnecessary."
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                Every Atelier piece is a dialogue between heritage craftsmanship and the modern silhouette.
                We believe in clothes that tell a story without saying a word.
              </p>
              <a href="#" className="inline-flex items-center space-x-4 group border-b border-white/20 pb-2">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">The Atelier Journal</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-2" />
              </a>
            </div>
            <div className="aspect-[4/5] lg:h-full relative overflow-hidden">
              <img
                src="/assets/Process.png"
                alt="Philosophy Portrait"
                className="w-full h-full object-cover brightness-75"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="section-container py-32 text-center">
          <h2 className="text-4xl lg:text-5xl mb-6">Join the Circle</h2>
          <p className="text-brand-black/60 mb-12">Receive early access to seasonal lookbooks and private collection releases.</p>
          <form className="flex flex-col sm:flex-row gap-4 border-b border-black pb-2">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="flex-grow bg-transparent outline-none text-[11px] tracking-widest py-3 font-medium uppercase"
            />
            {/* <button className="text-[11px] font-bold tracking-[0.2em] uppercase py-3 px-8 hover:text-orange-600 transition-colors">
              Subscribe
            </button> */}
           <Button variant='primary' size='lg'>Subscribe</Button>
          </form>
        </section>

      {/* Footer */}
      {/* <footer className="bg-brand-black text-white pt-24 pb-12 border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="space-y-8">
            <h3 className="text-xl font-serif tracking-tighter uppercase font-bold">Atelier</h3>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Defining modern luxury through meticulous craft and quiet expression.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">Collections</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:opacity-60 transition-opacity">New Arrivals</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Womenswear</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Menswear</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">About</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:opacity-60 transition-opacity border-b border-white pb-1">Sustainability</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Shipping</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Returns</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">Connect</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Pinterest</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Threads</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-40 gap-4">
          <p>© 2026 Atelier. All rights reserved.</p>
          <div className="flex space-x-12">
            <span>United States / EN</span>
            <button className="hover:opacity-100">Cookie Settings</button>
          </div>
        </div>
      </footer> */}
    </div>
  );
}


// http://localhost:1337/api/categories?populate[image][populate]=*&populate[products][populate][image][populate]=*&populate[products][populate][productVariation][populate][image][populate]=*

// http://localhost:1337/api/categories?filters[slug][$eq]=cloths&populate[image][populate]=*&populate[products][populate][image][populate]=*&populate[products][populate][productVariation][populate][image][populate]=*



// const [activeFilter, setActiveFilter] = useState({
//   type: "category", // "category" | "size" | "color"
//   value: "shoose",
// });

// const buildUrl = ({ type, value }) => {
//   const base = "http://localhost:1337/api/products?populate=*";

//   if (type === "category") {
//     return `${base}&filters[category][slug][$eq]=${value}`;
//   }

//   if (type === "size") {
//     return `${base}&filters[productVariation][size][$eq]=${value}`;
//   }

//   if (type === "color") {
//     return `${base}&filters[productVariation][name][$eq]=${value}`;
//   }

//   return base;
// };



// const buildUrl = ({ type, value }) => {
//   const base =
//     "http://localhost:1337/api/products" +
//     "?populate[image]=*" +
//     "&populate[category]=*" +
//     "&populate[productVariation][populate]=*";

//   if (type === "category") {
//     return `${base}&filters[category][slug][$eq]=${value}`;
//   }

//   if (type === "size") {
//     return `${base}&filters[productVariation][size][$eq]=${value}`;
//   }

//   if (type === "color") {
//     return `${base}&filters[productVariation][name][$eq]=${value}`;
//   }

//   return base;
// };