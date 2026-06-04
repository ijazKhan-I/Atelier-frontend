import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Modern luxury fashion and timeless essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body className="min-h-screen bg-brand-offwhite text-brand-black font-sans flex flex-col">
        
        <Header />

        <main className="flex-1 pt-20">
          {children}
        </main>

        <Footer />
      </body>
  );
}
